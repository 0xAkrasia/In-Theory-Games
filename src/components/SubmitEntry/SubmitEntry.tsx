import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { BrowserProvider, Contract } from 'ethers';
import twoThirdsGameABI from '../Contracts/twoThirdsGame_vInco_ABI.json';
import { getInstance } from '../../fhevmjs';
import { ErrorDecoder } from 'ethers-decode-error'
import contractAddresses from '../Contracts/contractAddresses.json';
import { faucet } from '../Faucet';

const contractAddress = contractAddresses[0].twoThirdsGame_vInco;
const contractABI = twoThirdsGameABI;

export const SubmitEntry = (props: any) => {

    const [loading, setLoading] = useState(false);
    const [entry, setEntry] = useState('');
    const { wallets } = useWallets();
    props.onEntrySubmit(entry);

    faucet();

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const w = wallets[0];
            if (w.chainId !== "eip155:9090") {
                await w.switchChain(9090);
            };
        } finally {
            console.log('On Inco');
        }

        try{
            const currentWallet = await wallets[0]?.getEthereumProvider();
            const bp = new BrowserProvider(currentWallet);
            const signer = await bp.getSigner();

            const instance = await getInstance(bp);
            if (instance === undefined) {
                alert('Please connect to Inco')
                setLoading(false);
                return;
            }

            // create contract object and execute transaction
            const ttgContract = new Contract(contractAddress, contractABI, signer);

            // check if the player entry is a whole number between 1 and 100
            const value = parseInt(entry, 10);
            if (!Number.isInteger(value) || value <= 0 || value > 100) {
                alert('Please select a whole number between 1 and 100')
                setLoading(false);
                return;
            };

            // check if the player has already submitted an entry
            const firstPlayCheck = await ttgContract.entries(signer);
            if (firstPlayCheck.toString() !== "0") {
                alert('Player already has a submission')
                setLoading(false);
                return;
            };

            // check if the game has ended
            const gameOverCheck = await ttgContract.gameOver();
            if (gameOverCheck) {
                alert('The Game has ended')
                setLoading(false);
                return;
            };

            const encryptedUint32 = instance.encrypt32(parseInt(entry, 10));
            const tx = await ttgContract.enterGame(encryptedUint32);
            await tx.wait();

            props.onEntrySubmit(entry); // pass entry to parent component
 
            } catch (err) {
                const errorDecoder = ErrorDecoder.create()
                const { reason, type } = await errorDecoder.decode(err)
                console.log('Revert reason:', reason)
                console.log(type)
                setLoading(false);
                return;
            }
        };

    return(
        <div className="w-layout-vflex thin-wrapper">
            {loading ? (
                <div className="spinner"></div>
                ) : (
                    <div className="w-layout-vflex main-content">
                        <div className="form-block w-form">
                            <input
                                className="text-field w-input"
                                name="entry"
                                id="entry"
                                placeholder="1-100"
                                type="number"
                                min="0"
                                max="100"
                                onChange={(e) => setEntry(e.target.value)}
                            />
                            <button className="primary-button w-inline-block" onClick={handleSubmit}>
                                <div className="button-text">
                                    Submit
                                </div>
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};