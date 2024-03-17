const { createInstance } = require("fhevmjs");
const { JsonRpcProvider } = require("ethers");
const { AbiCoder } = require('ethers');
const TwoThirdsGame = artifacts.require("TwoThirdsGame");
const ethSigUtil = require('eth-sig-util');
const eth_util = require("ethereumjs-util");
const fs = require('fs');

contract("TwoThirds Game Tests", accounts => {
  const userAddress = accounts[0];
  const CONTRACT_ADDRESS = '0x17337238c7207574d81f9f1c749c33c1193fd3f7';
  let twoThirdsGame;
  let instance; // The FHE instance


  before(async () => {
    const provider = new JsonRpcProvider(`https://testnet.inco.org`);
    const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";
    const network = await provider.getNetwork();
    const chainId = +network.chainId.toString();
    const ret = await provider.call({
      to: FHE_LIB_ADDRESS,
      data: "0xd9d47bb001",
    });
    const decoded = AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
    const publicKey = decoded[0];
    instance = await createInstance({ chainId, publicKey });
    console.log("FHE instance created", instance);
    twoThirdsGame = await TwoThirdsGame.at(CONTRACT_ADDRESS);
    console.log("KeynesianBeautyContest deployed at", twoThirdsGame.address);
  });

  // Get or generate the end user's local keypair.
  const getReencryptPublicKey = async (contractAddress) => {
    if (!instance.hasKeypair(contractAddress)) {
      const eip712Domain = {
        name: 'Authorization token',
        version: '1',
        chainId: 9090,
        verifyingContract: contractAddress,
      }

      const reencryption = instance.generatePublicKey(eip712Domain);
      const privateKey = fs.readFileSync('key.txt', 'utf8').trim();
      const privateKeyBuffer = eth_util.toBuffer(privateKey);

      signature = ethSigUtil.signTypedData_v4(privateKeyBuffer, {
        data: {
          types: reencryption.eip712.types,
          domain: eip712Domain,
          primaryType: 'Reencrypt',
          message: reencryption.eip712.message
        }
      });

      instance.setSignature(contractAddress, signature);
    }

    return instance.getPublicKey(contractAddress);
  };


  describe("Vote and check winner", () => {
    it("get voted number for each voter", async () => {
      const voted = ["0xAB99D5f73A13Fae479457A3FaD0836Dd2c75c649", "0x172df09993393Baf2fCcE8411a65526831e124DD", "0xa27C766Ce13eEc839666679162917575b5298392",
        "0x057f3a4374F03980500B85631dC11a89C845aeAE", "0xfb00420fb9dC8849559713FEA110d6f1c3805114", "0x99BFB73737f966bb43eD906a166c767c3b9a2843",
        "0x1873C4A40efd645caf0FF3CD4bbBcb6c666a3d23", "0x937c87AA2ab7b29BCb7244B3925b67770642A9d9", "0xCd8945f231376CFE4f3DdaA0cb6c1a56b4681c95",
        "0x7f7589DBA9259FC285EC4DA9E5017fF99a12449C", "0xa509BF24f815159Fe65eCAfbEA017A287184328f", "0xBbF751A6fa103f34b4EFc2dAe178254437b9F9a0",
        "0x507167F6F680c58138E156Ff918dD440D0f175D6", "0x4b433B8DA7CE634AEA17D854606e4cd08100d419", "0x97bbdb2529A2cD9c3Ee85268418eDA9fbc41a64d",
        "0xf96eD7f551Ec1127b42cd01EACa01EaC8e5080fA", "0x36860Bb54C3bD017531465d5a6058Be40af6020D", "0xAB336c7119af467B724010Cbba48B71658021C37",
        "0x3C44886486AaD8c4989894c29ACf0BD8c95b0299", "0x874f4Ecac35A5F3aa9C199450F61FC97ADABb386", "0x9e6ea1b5a68C5E1AEB8702f4E5583fac77b55f8b", "0xE559C6947fD128e68FCb6d59FF9AB9a3818f204B"];
      for (const voteAddr of voted) {
        const reencrypt = await getReencryptPublicKey(CONTRACT_ADDRESS);
        const reencryptPublicKeyHexString = "0x" + Array.from(reencrypt.publicKey)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        const encryptedVote = await twoThirdsGame.reencryptAny(voteAddr, reencryptPublicKeyHexString, reencrypt.signature);
        const vote = await instance.decrypt(CONTRACT_ADDRESS, encryptedVote);
        console.log("address", voteAddr, "Vote", vote);
      }
    });
  });
});



