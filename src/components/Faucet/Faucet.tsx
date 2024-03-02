import { useWallets } from '@privy-io/react-auth';
import { BrowserProvider, formatEther } from 'ethers';

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

export async function faucet() {
    const { wallets } = useWallets();
    const w = wallets[0];

    try {
        if (w.chainId !== "eip155:9090") {
            await w.switchChain(9090);
        };
    } finally {
        console.log('On Inco');
    }

    const eipProvider = await wallets[0]?.getEthereumProvider();
    const bp = new BrowserProvider(eipProvider);
    const address = w.address;

    const bal = await fetchBalance(bp, address);

    if (bal < .3) {
        fundWallet(address);
    };
};