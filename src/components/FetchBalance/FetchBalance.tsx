import React, { useState, useEffect, HTMLAttributes } from 'react';
import { ethers } from 'ethers';
import contractAddresses from '../Contracts/contractAddresses.json';

const provider = new ethers.JsonRpcProvider(`https://evm-rpc.inco.network`);
const contractAddress = contractAddresses[0].twoThirdsGame_vInco;

interface FetchBalanceProps extends HTMLAttributes<HTMLDivElement> {}

export const FetchBalance: React.FC<FetchBalanceProps> = (props) => {
    const [balance, setBalance] = useState('');

    useEffect(() => {
        const fetchBalance = async (address: string) => {
            try {
                const rawBalance = await provider.getBalance(address);
                const formattedBal = ethers.formatEther(rawBalance);
                setBalance(formattedBal);
            } catch (error) {
                console.error('Error fetching balance:', error);
                setBalance('Error fetching balance');
            }
        };

        fetchBalance(contractAddress);
    }, []);

    const { className, ...rest } = props;

    return (
        <div className={className} {...rest}>Pot: {balance} INCO</div>
    );
};