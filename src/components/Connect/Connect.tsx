import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import './Connect.css';
import { createFhevmInstance } from '../../fhevmjs';

const AUTHORIZED_CHAIN_ID = [`0x${Number(9090).toString(16)}`];

export const Connect = () => {
  const [connected, setConnected] = useState(false);
  const [validNetwork, setValidNetwork] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const refreshAccounts = (accounts: string[]) => {
    setAccount(accounts[0] || '');
    setConnected(accounts.length > 0);
  };

  const hasValidNetwork = async (): Promise<boolean> => {
    const currentChainId: string = await window.ethereum.request({ method: 'eth_chainId' });
    return AUTHORIZED_CHAIN_ID.includes(currentChainId.toLowerCase());
  };

  const refreshNetwork = useCallback(async () => {
    if (await hasValidNetwork()) {
      await createFhevmInstance();
      setValidNetwork(true);
    } else {
      setValidNetwork(false);
    }
  }, []);

  const refreshProvider = (eth: Eip1193Provider) => {
    const p = new BrowserProvider(eth);
    setProvider(p);
    return p;
  };

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) {
      setError('No wallet has been found');
      return;
    }

    const p = refreshProvider(eth);

    p.send('eth_accounts', [])
      .then(async (accounts: string[]) => {
        refreshAccounts(accounts);
        await refreshNetwork();
      })
      .catch(() => {
        // Do nothing
      });
    eth.on('accountsChanged', refreshAccounts);
    eth.on('chainChanged', refreshNetwork);
  }, [refreshNetwork]);

  const connect = async () => {
    if (!provider) {
      return;
    }
    const accounts: string[] = await provider.send('eth_requestAccounts', []);

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setConnected(true);
      if (!(await hasValidNetwork())) {
        await switchNetwork();
      }
    }
  };

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AUTHORIZED_CHAIN_ID[0] }],
      });
    } catch (e) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: AUTHORIZED_CHAIN_ID[0],
            rpcUrls: ['https://evm-rpc.inco.network'],
            chainName: 'Inco Network',
            nativeCurrency: {
              name: 'INCO',
              symbol: 'INCO',
              decimals: 18,
            },
            blockExplorerUrls: ['https://explorer.inco.network/'],
          },
        ],
      });
    }
    await refreshNetwork();
  }, [refreshNetwork]);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const child = useMemo<React.ReactNode>(() => {
    if (!account || !provider) {
      return (
        <div>
            <button onClick={connect}>
              Connect
            </button>
        </div>
      );
    }

    if (!validNetwork) {
      return (
        <div>
            <button onClick={switchNetwork}>
              Switch to Inco
            </button>
        </div>
      );
    }
    else if (connected) {
      return (
        <div>
          <button onClick={connect}>
            {`${formatAddress(account)}`}
          </button>
        </div>
      );
    }
  }, [account, provider, validNetwork, switchNetwork, connected, connect, formatAddress]);

  if (error) {
    return <p>No wallet found</p>;
  }

  return (
    <>
      <div>{child}</div>
    </>
  );
};
