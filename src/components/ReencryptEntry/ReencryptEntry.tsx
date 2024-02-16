import { useEffect } from 'react';
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import twoThirdsGameABI from '../Contracts/twoThirdsGame_vInco_ABI.json';
import contractAddresses from '../Contracts/contractAddresses.json';
import { getInstance, getTokenSignature } from '../../fhevmjs';
import { useWallets } from '@privy-io/react-auth';

export const ReencryptEntry = () => {
    const { wallets } = useWallets();

    useEffect( () => {
        const fetchReencryptedEntry = async () => {
            try {
                const provider = new JsonRpcProvider(`https://testnet.inco.org`);

                const contractABI = twoThirdsGameABI;
                const contractAddress = contractAddresses[0].twoThirdsGame_vInco;

                const eipProvider = await wallets[0]?.getEthereumProvider();
                const bp = new BrowserProvider(eipProvider);
                const signer = await bp.getSigner();
                const userAddress = await signer.getAddress();

                const instance = await getInstance(bp);
                if (instance === undefined) {alert('Please connect to Inco')}
            
                const ttgContract = new Contract(contractAddress, contractABI, provider);

                // Generate token to decrypt
                const generatedToken = instance.generatePublicKey({
                    verifyingContract: contractAddress,
                });
                console.log(generatedToken);

                // Sign the public key
                const params = [userAddress, JSON.stringify(generatedToken.eip712)];
                const signature = await window.ethereum.request({
                    method: 'eth_signTypedData_v4',
                    params,
                });
                // instance.setPublicKeySignature(contractAddress, signature);

                // call method
                console.log(generatedToken.publicKey);
                console.log(signature);
                const encryptedEntry = await ttgContract.reencryptSelf(generatedToken.publicKey, signature);
                console.log(encryptedEntry);

                // decrypt entry
                const x = instance.decrypt(contractAddress, encryptedEntry);
                console.log(x.toString());
            } catch (error) {
                console.error('Failed to fetch entry:', error);
                console.log('101');
            }
        };

        fetchReencryptedEntry();

    }, []);

    // onClick={fetchReencryptedEntry}
    return (
        <div className="w-layout-vflex thin-wrapper">
            <div className="w-layout-vflex main-content">
                <button className="primary-button w-inline-block button-text">
                    See your entry
                </button>
            </div>
        </div>
    );
};