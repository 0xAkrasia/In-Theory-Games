// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13 <0.9.0;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";
import "hardhat/console.sol";

contract TwoThirdsGame is EIP712WithModifier {
    address public owner;
    bool public gameOver;
    mapping(address => euint32) public entries;
    address[] public players;
    uint256 public playerCount;
    euint32 private enSum;
    address[] public winners;
    uint256 private max_diff;
    uint256 public solution;
    mapping(address => bool) public winChecked;

    constructor() EIP712WithModifier("Authorization token", "1") {
        owner = msg.sender;
        gameOver = false;
        max_diff = 100 * 1e2;
        playerCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier gameEnded() {
        require(gameOver, "The game is not over");
        _;
    }

    function enterGame(bytes calldata encryptedValue) external payable {
        require(!gameOver, "The game has ended");
        require(!TFHE.isInitialized(entries[msg.sender]), "player already has a submission");

        euint32 entry = TFHE.asEuint32(encryptedValue);

        entries[msg.sender] = entry;
        enSum = TFHE.add(entry, enSum);
        players.push(msg.sender);
        playerCount += 1;

        ebool le_hundred = TFHE.le(entry, TFHE.asEuint32(100));
        ebool gt_zero = TFHE.gt(entry, TFHE.asEuint32(0));

        TFHE.optReq(le_hundred);
        TFHE.optReq(gt_zero);
    }

    function endGame() public onlyOwner {
        gameOver = true;
    }

    function determineSolution() public onlyOwner gameEnded {
        uint256 deSum = TFHE.decrypt(enSum);
        uint256 average = (deSum * 1e2) / playerCount;
        solution = (average * 2) / 3;
    }

    function winCheck(address player) public gameEnded {
        require(!winChecked[player], "This entry has already been checked");
        uint256 entry = TFHE.decrypt(entries[player]) * 1e2;
        uint256 diff = entry > solution ? entry - solution : solution - entry;
        if (diff < max_diff) {
            delete winners;
            winners.push(player);
            max_diff = diff;
        } else if (diff == max_diff) {
            winners.push(player);
        }
        winChecked[player] = true;
    }

    function reencryptSelf(bytes32 publicKey, bytes calldata signature)
        public
        view
        onlySignedPublicKey(publicKey, signature)
        returns (bytes memory)
    {
        return TFHE.reencrypt(entries[msg.sender], publicKey, 0);
    }

    function reencryptAny(address player, bytes32 publicKey, bytes calldata signature)
        public
        view
        onlySignedPublicKey(publicKey, signature)
        gameEnded
        returns (bytes memory)
    {
        return TFHE.reencrypt(entries[player], publicKey, 0);
    }
}