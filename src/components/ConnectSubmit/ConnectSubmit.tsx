import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { BrowserProvider, Contract} from 'ethers';
import twoThirdsGameABI from '../Contracts/twoThirdsGame_vInco_ABI.json';
import contractAddresses from '../Contracts/contractAddresses.json';
import { LoginButton } from '../LoginButton';
import { SubmitEntry } from '../SubmitEntry';
import { SubmissionComplete } from '../SubmissionComplete';
import { GameEnded } from '../GameEnded';

const contractAddress = contractAddresses[0].twoThirdsGame_vInco;
const contractABI = twoThirdsGameABI;

export const ConnectSubmit = () => {
    const { authenticated } = usePrivy();
    const { wallets } = useWallets();

    const [entry, setEntry] = useState(null);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const gameOverCheck = async () => {

        try {
            if(wallets.length > 0 && await wallets[0]?.isConnected()) {
                const currentWallet = await wallets[0]?.getEthereumProvider();
                const bp = new BrowserProvider(currentWallet);
                const signer = await bp.getSigner();
                const ttgContract = new Contract(contractAddress, contractABI, signer);
                const firstPlayCheck = await ttgContract.gameOver();

                console.log("Submission check - Wallet provider:", currentWallet, "Contract:", ttgContract);
                console.log("First play check:", firstPlayCheck.toString());

                setGameOver(firstPlayCheck.toString() !== "0");
            }
        } catch (error) {
            console.error("Error checking game status:", error);
        }
    };

    gameOverCheck()

    useEffect(() => {
        
        if (alreadySubmitted) {
            return;
        }

        const initialSetupAndCheck = async () => {
            if(wallets.length > 0 && await wallets[0]?.isConnected()) {
                const currentWallet = await wallets[0]?.getEthereumProvider();
                console.log("Initial wallet provider:", currentWallet);
            }
        };

        initialSetupAndCheck();

        const submissionCheck = async () => {

            try {
                if(wallets.length > 0 && await wallets[0]?.isConnected()) {
                    const currentWallet = await wallets[0]?.getEthereumProvider();
                    const bp = new BrowserProvider(currentWallet);
                    const signer = await bp.getSigner();
                    const ttgContract = new Contract(contractAddress, contractABI, signer);
                    const firstPlayCheck = await ttgContract.entries(signer.address);

                    console.log("Submission check - Wallet provider:", currentWallet, "Contract:", ttgContract);
                    console.log("First play check:", firstPlayCheck.toString());

                    setAlreadySubmitted(firstPlayCheck.toString() !== "0");
                }
            } catch (error) {
                console.error("Error checking submission:", error);
            }
        };

        const intervalId = setInterval(submissionCheck, 2000);
        return () => clearInterval(intervalId);
    }, [wallets, alreadySubmitted]); // re-run the effect when wallets or alreadySubmitted change

    if (!authenticated) {
        return <LoginButton/>;
    } else if (authenticated && !alreadySubmitted) {
        return <SubmitEntry onEntrySubmit={setEntry}/>;
    } else if (authenticated && alreadySubmitted) {
        return <SubmissionComplete entry={entry}/>;
    } else if (authenticated && gameOver) {
        return <GameEnded/>;
    } else {
        return <div> 'Please refresh page' </div>;
    }
};