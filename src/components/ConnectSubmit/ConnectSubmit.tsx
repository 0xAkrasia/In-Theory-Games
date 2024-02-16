import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { BrowserProvider, Contract, formatEther} from 'ethers';
import twoThirdsGameABI from '../Contracts/twoThirdsGame_vInco_ABI.json';
import { getInstance } from '../../fhevmjs';
import { ErrorDecoder } from 'ethers-decode-error'
import fi_arrow_up_right from '../../images/fi_arrow-up-right.png'
import contractAddresses from '../Contracts/contractAddresses.json';

const contractAddress = contractAddresses[0].twoThirdsGame_vInco;
const contractABI = twoThirdsGameABI;

const fetchBalance = async (provider: any, address: string) => {
    const rawBalance = await provider.getBalance(address);
    const bal = formatEther(rawBalance);
    const formattedBal = parseFloat(bal);

    return formattedBal;
};

async function fundWallet(walletAddress: string): Promise<boolean> {
    const response = await fetch('https://faucet.testnet.inco.org/api/get-faucet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: walletAddress
      })
    });
  
    return response.ok;
};

async function faucet() {
    const { wallets } = useWallets();

    const w = wallets[0];
    await w.switchChain(9090);

    const eipProvider = await wallets[0]?.getEthereumProvider();
    const bp = new BrowserProvider(eipProvider);

    const signer = await bp.getSigner();
    const address = await signer.getAddress();

    const bal = await fetchBalance(bp, address);

    if (bal < 3e14) {
        fundWallet(address);
    };
};

function LoginButton() {
    const { login } = usePrivy();
    const handleLogin = async () => {
        login();

    };
    return (
        <div onClick={handleLogin} className="button-text">
            Connect Wallet to Play
        </div>
    );
};

export const ConnectSubmit = () => {
    const { authenticated } = usePrivy();
    const { wallets } = useWallets();

    const [entry, setEntry] = useState('');

    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    useEffect(() => {
        const submissionCheck = async () => {
            try {
                const currentWallet = await wallets[0]?.getEthereumProvider();
                const bp = new BrowserProvider(currentWallet);
                const signer = await bp.getSigner();
                const ttgContract = new Contract(contractAddress, contractABI, signer);
                const firstPlayCheck = await ttgContract.entries(signer);
                if (firstPlayCheck.toString() !== "0") {
                    setAlreadySubmitted(true);
                } else {
                    setAlreadySubmitted(false);
                }
            } catch (error) {
                console.error("Error checking submission:", error);
            };
        };

        // Start the interval
        const intervalId = setInterval(submissionCheck, 5000); // runs every 5 sec

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const handleClick = async () => {
        try {
            const currentWallet = await wallets[0]?.getEthereumProvider();
            const bp = new BrowserProvider(currentWallet);
            const signer = await bp.getSigner();

            const instance = await getInstance(bp);
            if (instance === undefined) {alert('Please connect to Inco')}

            // create contract object and execute transaction
            const ttgContract = new Contract(contractAddress, contractABI, signer);
    
            // check if the player entry is a whole number between 1 and 100
            const value = parseInt(entry, 10);
            if (!Number.isInteger(value) || value <= 0 || value > 100) {alert('Please select a whole number between 1 and 100')};
    
            // check if the player has already submitted an entry
            const firstPlayCheck = await ttgContract.entries(signer);
            if (firstPlayCheck.toString() !== "0") {alert('Player already has a submission')};
    
            // check if the game has ended
            const gameOverCheck = await ttgContract.gameOver();
            if (gameOverCheck) {alert('The Game has ended')};
    
            const encryptedUint32 = instance.encrypt32(parseInt(entry, 10));
    
            const errorDecoder = ErrorDecoder.create()
    
            try {
                const tx = await ttgContract.enterGame(encryptedUint32);
                await tx.wait();
            } catch (err) {
                const { reason, type } = await errorDecoder.decode(err)
                console.log('Revert reason:', reason)
                console.log(type)
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (!authenticated) {
        return (
            <div className="w-layout-vflex thin-wrapper">
                <div className="w-layout-vflex main-content">
                    <button className="primary-button w-inline-block">
                        <LoginButton/>
                    </button>
                </div>
            </div>
        );
    } else if (authenticated && !alreadySubmitted) {
        faucet();
        return (
            <div className="w-layout-vflex thin-wrapper">
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
                        <button className="primary-button w-inline-block" onClick={handleClick}>
                            <div className="button-text">
                                Submit
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    } else if (authenticated && alreadySubmitted) {
        return (
            <div className="w-layout-vflex thin-wrapper">
                <div className="w-layout-vflex main-content">
                    <div className="w-layout-vflex user-entry">
                        <p className="paragraph tagline">
                            Your entry
                        </p>
                        <p className="display">
                            {entry}
                        </p>
                    </div>
                    <a href="#" className="primary-button w-inline-block">
                        <div className="button-text">
                            Claim Poap
                        </div>
                        <img src={fi_arrow_up_right} loading="lazy" width={20} height={20} alt="" className="chevron" />
                    </a>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                'Please refresh page'
            </div>
        );
    }
};