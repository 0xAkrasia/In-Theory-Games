import React, { useState, useEffect, HTMLAttributes } from 'react';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`https://evm-rpc.inco.network`);
const address = '0x1a83f1d0ea8e2a2925B2062843CF82bAff516762';

interface FetchBalanceProps extends HTMLAttributes<HTMLDivElement> {}

export const FetchBalance: React.FC<FetchBalanceProps> = (props) => {
    const [balance, setBalance] = useState('');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const rawBalance = await provider.getBalance(address);
                const formattedBal = ethers.formatEther(rawBalance);
                setBalance(formattedBal);
            } catch (error) {
                console.error('Error fetching balance:', error);
                setBalance('Error fetching balance');
            }
        };

        fetchBalance();
    }, []);

    const { className, ...rest } = props;

    return (
        <div className={className} {...rest}>Pot: {balance} INCO</div>
    );
};