import { EIP1193Provider } from '@privy-io/react-auth';
import { BrowserProvider, AbiCoder } from 'ethers';
import { initFhevm, createInstance, FhevmInstance } from 'fhevmjs';

export const init = async () => {
  await initFhevm();
};

const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";
let instance: FhevmInstance;

export const createFhevmInstance = async (provider: BrowserProvider) => {
  // Get blockchain public key
  const ret = await provider.call({
    to: FHE_LIB_ADDRESS,
    // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
    data: "0xd9d47bb001",
  });

  const decoded = AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
  const publicKey = decoded[0];

  instance = await createInstance({ chainId: 9090, publicKey });
};

export const getInstance = async (p: BrowserProvider) => {
  await init();
  await createFhevmInstance(p);
  return instance;
};

export const getTokenSignature = async (contractAddress: string, userAddress: string, provider: EIP1193Provider) => {
  // const instance = await createInstance({ chainId, publicKey });
  const { publicKey, token } = instance.generateToken({
    verifyingContract: contractAddress,
  });
  const params = [userAddress, JSON.stringify(token)];
  const signature = await provider.request({
    method: "eth_signTypedData_v4",
    params,
  });
  instance.setTokenSignature(contractAddress, signature);
  return { signature, publicKey };
};