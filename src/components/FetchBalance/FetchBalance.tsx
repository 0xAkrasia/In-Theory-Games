import React, { useState, useEffect, HTMLAttributes } from 'react';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`https://evm-rpc.inco.network`);
const address = '0xAB99D5f73A13Fae479457A3FaD0836Dd2c75c649';

// Extending the standard HTML div attributes
interface FetchBalanceProps extends HTMLAttributes<HTMLDivElement> {}

export const FetchBalance: React.FC<FetchBalanceProps> = (props) => {
    const [balance, setBalance] = useState('');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const rawBalance = await provider.getBalance(address);
                const formattedBal = ethers.formatEther(rawBalance);
                const dollarFormattedBal = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(parseFloat(formattedBal));
                setBalance(dollarFormattedBal);
            } catch (error) {
                console.error('Error fetching balance:', error);
                setBalance('Error fetching balance');
            }
        };

        fetchBalance();
    }, []);

    // Destructure the className from props
    const { className, ...rest } = props;

    return (
        <div className={className} {...rest}>Pot: {balance}</div>
    );
};

