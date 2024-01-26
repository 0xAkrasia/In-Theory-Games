import { useState } from 'react';
import { BrowserProvider, ethers, parseUnits, getDefaultProvider } from 'ethers';
import twoThirdsGame from '../Contracts/twoThirdsGameABI.json';
import { getInstance } from '../../fhevmjs';
import { FetchBalance } from '../FetchBalance';

// create contract object
const contractAddress = '0x17337238c7207574D81F9f1C749C33c1193FD3F7';
const contractABI = twoThirdsGame;

export const EnterGameButton = () => {
    const [entry, setEntry] = useState('');
    // const [txReceived, setTxReceived] = useState(false);

    const handleClick = async () => {

        let signer = null;
        let provider;
        if (window.ethereum == null) {
            console.log("MetaMask not installed; using read-only defaults")
            provider = getDefaultProvider();
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
        const value = parseInt(entry, 10);
        if (!Number.isInteger(value) || value < 0 || value > 100) {alert('Please select a whole number between 0 and 100')};

        const encryptedUint32 = instance.encrypt32(parseInt(entry, 10));

        try {
            const testing = await ttgContract.enterGame(encryptedUint32, {value: entryValue})
            console.log(testing);

        } catch (error) {
            
            if (error.message.includes('player already has a submission')) {
                alert('You already entered the game');
            } else if (error.message.includes('Send 0.01 ETH to enter')) {
                alert('Send at least 0.01 ETH to enter')
            } else if (error.message.includes('The game has ended')) {
                alert('The game has ended')
            }
        }
    };

    return (
        <div>
            <p>
                Each player submits a whole number between 0 and 100.
            </p>
            <p>
                The player who guesses closest to two thirds of the average wins and collects the pot.
            </p>
            <p>
                It costs 0.01 INCO to enter.
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
            <p></p>
            <FetchBalance/>
        </div>
    );
};