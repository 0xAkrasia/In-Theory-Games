// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13 <0.9.0;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";
import "hardhat/console.sol";

contract TwoThirdsGame is EIP712WithModifier {
    event potDonation(address, uint256);
    event averageEmit(uint256);
    event solutionEmit(uint256);
    event entryEmit(uint256);
    event gameOverEmit(bool);
    event winnersEmit(address[]);

    address public owner;
    bool public gameOver;
    mapping(address => euint32) public entries;
    address[] public players;
    euint32 private enSum;
    mapping(address => uint256) public decryptEntries;
    address[] public winners;
    uint256 private max_diff;
    uint256 public solution;
    mapping(address => uint8) private winChecked;

    constructor() EIP712WithModifier("Authorization token", "1") {
        owner = msg.sender;
        gameOver = false;
        max_diff = 100;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier gameEnded() {
        require(gameOver, "Game is ongoing");
        _;
    }

    receive() external payable {
        emit potDonation(msg.sender, msg.value);
    }

    function enterGame(bytes calldata encryptedValue) external payable {
        require(!gameOver, "The game has ended");
        require(msg.value == 0.01 ether, "Send 0.01 ETH to enter");
        require(!TFHE.isInitialized(entries[msg.sender]), "player already has a submission");

        euint32 entry = TFHE.asEuint32(encryptedValue);

        entries[msg.sender] = entry;
        enSum = TFHE.add(entry, enSum);
        players.push(msg.sender);

        ebool le_hundred = TFHE.le(entry, TFHE.asEuint32(100));
        ebool gt_zero = TFHE.gt(entry, TFHE.asEuint32(0));

        TFHE.optReq(le_hundred);
        TFHE.optReq(gt_zero);
    }

    function endGame() public onlyOwner {
        gameOver = true;
        emit gameOverEmit(gameOver);
    }

    function determineSolution() public onlyOwner gameEnded {
        uint256 deSum = TFHE.decrypt(enSum);
        uint256 average = (deSum * 1e2) / players.length;
        solution = (average * 2) / 3;

        emit averageEmit(average);
        emit solutionEmit(solution);
    }

    function winCheck() public gameEnded {
        uint256 entry = TFHE.decrypt(entries[msg.sender]);
        emit entryEmit(entry);
        entry = entry*1e2;
        uint256 diff = entry > solution ? entry - solution : solution - entry;
        if (winChecked[msg.sender] == 0) {
            if (diff < max_diff) {
                delete winners;
                winners.push(msg.sender);
                max_diff = diff;
            } else if (diff == max_diff) {
                winners.push(msg.sender);
            }
        }
        winChecked[msg.sender] = 1;
    }

    function payWinners() public onlyOwner gameEnded {
        emit winnersEmit(winners);
        uint256 prize = address(this).balance / winners.length;
        for (uint256 i = 0; i < winners.length; i++) {
            payable(winners[i]).transfer(prize);
        }
    }

    function reencryptEntry(address player, bytes32 publicKey, bytes calldata signature)
        public
        view
        onlySignedPublicKey(publicKey, signature)
        gameEnded
        returns (bytes memory)
    {
        return TFHE.reencrypt(entries[player], publicKey);
    }
}