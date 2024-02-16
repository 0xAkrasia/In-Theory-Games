import { useState, useEffect} from 'react';
import { ethers } from 'ethers';
import twoThirdsGameABI from '../Contracts/twoThirdsGame_vInco_ABI.json';
import contractAddresses from '../Contracts/contractAddresses.json';

const provider = new ethers.JsonRpcProvider(`https://testnet.inco.org`);

const contractABI = twoThirdsGameABI;
const contractAddress = contractAddresses[0].twoThirdsGame_vInco;
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export const FetchPlayerCount = () => {
    const [playerCount, setPlayerCount] = useState('');

    useEffect(() => {
        const fetchPlayerCount = async () => {
            try {
                const rawPlayerCount = await contract.playerCount();
                const stringPlayerCount = Intl.NumberFormat().format(rawPlayerCount)
                const formattedPlayerCount = stringPlayerCount === "1"
                    ? '1 Player'
                    : stringPlayerCount + " Players";
                setPlayerCount(formattedPlayerCount);
            } catch (error) {
                console.error('Failed to fetch player count:', error);
                setPlayerCount('-- Players');
            }
        };

        fetchPlayerCount();
    }, []);

    return playerCount;
};