import { useState } from 'react';
import { BrowserProvider, ethers, parseUnits, getDefaultProvider } from 'ethers';
import twoThirdsGame from '../Contracts/twoThirdsGameABI.json';
import { getInstance } from '../../fhevmjs';

// create contract object
const contractAddress = '0x24f9d9db4fcc282e6f679f4198f7292e318bd791';
const contractABI = twoThirdsGame;

export const EnterGameButton = () => {
    const [entry, setEntry] = useState('');
    // const [txReceived, setTxReceived] = useState(false);

    const handleClick = async () => {

        let signer = null;
        let provider;
        if (window.ethereum == null) {
            console.log("MetaMask not installed; using read-only defaults")
            provider = getDefaultProvider("inco");
        } else {
            provider = new BrowserProvider(window.ethereum)
            signer = await provider.getSigner();
        }

        console.log(provider)
        console.log(signer)

        const instance = getInstance();
        console.log(instance);
        if (instance === undefined) {alert('Please connect to Inco')}

        // create contract object and execute transaction
        const ttgContract = new ethers.Contract(contractAddress, contractABI, signer);
        const entryValue = parseUnits("0.01", 18);
        // const balance = await provider.getBalance(signer);
        const value = parseInt(entry, 10);
        if (!Number.isInteger(value) || value < 0 || value > 100) {alert('Please select a whole number between 0 and 100')}

        const encryptedUint32 = instance.encrypt32(parseInt(entry, 10));

        try {
            const testing = await ttgContract.enterGame.staticCall(encryptedUint32, {value: entryValue})
            console.log(testing);
        } catch (error) {
            if (error.message.includes('player already has a submission')) {
                alert('You already entered the game');
            } else if (error.message.includes('Send 0.01 ETH to enter')) {
                alert('Send at least 0.01 ETH to enter')
            } else if (error.message.includes('The game has ended')) {
                alert('The game has ended')
            } else {
                const tx = await ttgContract.enterGame(
                    encryptedUint32,
                    {value: entryValue}
                );
                // wait for transaction to be mined
                await tx.wait();
                console.log(tx);
            }
        }
    };

    return (
        <div>
            <p>
                Each player will submit a whole number between 0 and 100.
            </p>
            <p>
                The winner will be the player who guesses closest to two thirds of the average.
            </p>
            <input
                type="number"
                min="0"
                max="100"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Enter a number"
            />
            <p></p>
            <button onClick={handleClick}>
                {/* {entry ? 'Complete!' : 'Enter Game'} */}Enter Game
            </button>
        </div>
    );
};