import React, { useState, useEffect, HTMLAttributes } from 'react';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`https://evm-rpc.inco.network`);
const address = '0x17337238c7207574D81F9f1C749C33c1193FD3F7';

// Extending the standard HTML div attributes
interface FetchBalanceProps extends HTMLAttributes<HTMLDivElement> {}

export const FetchBalance: React.FC<FetchBalanceProps> = (props) => {
    const [balance, setBalance] = useState('');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const rawBalance = await provider.getBalance(address);
                const formattedBal = ethers.formatEther(rawBalance);
                // const dollarFormattedBal = new Intl.NumberFormat('en-US', {
                //     style: 'currency',
                //     currency: 'USD'
                // }).format(parseFloat(formattedBal));
                setBalance(formattedBal);
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
        <div className={className} {...rest}>Pot: {balance} INCO</div>
    );
};

