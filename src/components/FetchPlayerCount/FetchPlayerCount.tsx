import React, { useState, useEffect, HTMLAttributes } from 'react';
import { ethers } from 'ethers';
import twoThirdsGameABI from '../Contracts/twoThirdsGame_vInco_ABI.json';

const provider = new ethers.JsonRpcProvider(`https://evm-rpc.inco.network`);
const contractABI = twoThirdsGameABI;
const ContractAddress = '0x1a83f1d0ea8e2a2925B2062843CF82bAff516762';

const contract = new ethers.Contract(ContractAddress, contractABI, provider);

interface FetchPlayerCountProps extends HTMLAttributes<HTMLDivElement> {}

export const FetchPlayerCount: React.FC<FetchPlayerCountProps> = (props) => {
    const [playerCount, setPlayerCount] = useState('');

    useEffect(() => {
        const fetchPlayerCount = async () => {
            try {
                const rawPlayerCount = await contract.playerCount();
                setPlayerCount(rawPlayerCount.toString());
            } catch (error) {
                setPlayerCount('Error');
            }
        };

        fetchPlayerCount();
    }, []);

    // Destructure the className from props
    const { className, ...rest } = props;

    return (
        <div className={className} {...rest}>{playerCount} players so far</div>
    );
};