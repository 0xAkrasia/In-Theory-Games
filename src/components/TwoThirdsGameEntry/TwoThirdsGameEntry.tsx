import { useState } from 'react';
import { BrowserProvider, ethers, getDefaultProvider } from 'ethers';
import twoThirdsGameABI from '../Contracts/twoThirdsGame_vInco_ABI.json';
import { getInstance } from '../../fhevmjs';
import { ErrorDecoder } from 'ethers-decode-error'

const contractAddress = '0x1a83f1d0ea8e2a2925B2062843CF82bAff516762';
const contractABI = twoThirdsGameABI;

export const EnterGameButton = () => {
    const [entry, setEntry] = useState('');

    const handleClick = async () => {

        let signer = null;
        let provider;
        if (window.ethereum == null) {
            console.log("MetaMask not installed; using read-only defaults")
            provider = getDefaultProvider('mainnet');
        } else {
            provider = new BrowserProvider(window.ethereum)
            signer = await provider.getSigner();
        }

        const instance = getInstance();
        if (instance === undefined) {alert('Please connect to Inco')}

        // create contract object and execute transaction
        const ttgContract = new ethers.Contract(contractAddress, contractABI, signer);

        // check if the player entry is a whole number between 1 and 100
        const value = parseInt(entry, 10);
        if (!Number.isInteger(value) || value <= 0 || value > 100) {alert('Please select a whole number between 1 and 100')};

        // check if the player has already submitted an entry
        const firstPlayCheck = await ttgContract.entries(signer);
        console.log(firstPlayCheck);
        if (firstPlayCheck.toString() !== "0") {alert('Player already has a submission')};

        // check if the game has ended
        const gameOverCheck = await ttgContract.gameOver();
        if (gameOverCheck) {alert('The Game has ended')};

        const encryptedUint32 = instance.encrypt32(parseInt(entry, 10));

        const errorDecoder = ErrorDecoder.create()

        try {
            const tx = await ttgContract.enterGame(encryptedUint32);
            await tx.wait();
            console.log(tx);
        } catch (err) {
            const { reason, type } = await errorDecoder.decode(err)
            console.log('Revert reason:', reason)
            console.log(type)
          }
    };

    return (
        <div>
            <p>
                Submit a whole number between 1 and 100
            </p>
            <p>
                The player who guesses closest to two thirds of the average wins $1,000
            </p>
            <input
                type="number"
                min="0"
                max="100"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder=""
            />
            <p></p>
            <button onClick={handleClick}>
                {/* {entry ? 'Complete!' : 'Enter Game'} */}Enter Game
            </button>
            <p></p>
        </div>
    );
};