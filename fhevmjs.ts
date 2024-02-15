import { EIP1193Provider } from '@privy-io/react-auth';
import { BrowserProvider } from 'ethers';
import { initFhevm, createInstance, FhevmInstance } from 'fhevmjs';

export const init = async () => {
  await initFhevm();
};

let instance: FhevmInstance;

export const createFhevmInstance = async (p: BrowserProvider) => {
  const publicKey = await p.call({
    from: null,
    to: "0x0000000000000000000000000000000000000044",
  });
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