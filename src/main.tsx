import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {PrivyProvider} from '@privy-io/react-auth';
import { defineChain } from 'viem'
let privy_key = import.meta.env.VITE_PRIVY_KEY;

export const inco = defineChain({
  id: 9090,
  name: 'Inco Network Testnet',
  network: 'Inco Network Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'INCO',
    symbol: 'INCO',
  },
  rpcUrls: {
    default: {
        http: ['https://testnet.inco.org']
    },
    public: {
        http: ['https://testnet.inco.org']
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.inco.org/' },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={privy_key || ''}
      config={{
          loginMethods: ['wallet'],
          defaultChain: inco,
          supportedChains: [inco],
          appearance: {
              theme: 'dark',
              accentColor: '#676FFF',
              logo: './images/sculpture_no_art.png',
              showWalletLoginFirst: true,
              walletList: ['detected_wallets', 'metamask', 'coinbase_wallet', 'rainbow', 'wallet_connect'],
          },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
)