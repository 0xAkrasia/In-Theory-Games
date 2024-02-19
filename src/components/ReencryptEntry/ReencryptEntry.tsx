import { useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import twoThirdsGameABI from '../Contracts/twoThirdsGame_vInco_ABI.json';
import contractAddresses from '../Contracts/contractAddresses.json';
import { getInstance } from '../../fhevmjs';
import { useWallets } from '@privy-io/react-auth';

export const ReencryptEntry = () => {
    const { wallets } = useWallets();

    useEffect( () => {
        const fetchReencryptedEntry = async () => {
            try {
                // create contract and fhevmjs instance
                const contractABI = twoThirdsGameABI;
                const contractAddress = contractAddresses[0].twoThirdsGame_vInco;

                const eipProvider = await wallets[0]?.getEthereumProvider();
                const bp = new BrowserProvider(eipProvider);
                const signer = await bp.getSigner();
                const userAddress = await signer.getAddress();
                const ttgContract = new Contract(contractAddress, contractABI, bp);

                const instance = await getInstance(bp);
                if (instance === undefined) {alert('Please connect to Inco')}

                // Generate token to decrypt
                const generatedToken = instance.generatePublicKey({
                    chainId: 9090,
                    name: 'Authorization token',
                    // version: '1',
                    verifyingContract: contractAddress,
                });

                // Sign the public key
                const params = [userAddress, JSON.stringify(generatedToken.eip712)];
                const signature = await window.ethereum.request({
                    method: 'eth_signTypedData_v4',
                    params,
                });

                const encryptedEntry = await ttgContract.reencryptSelf(generatedToken.publicKey, signature);

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