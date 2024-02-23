import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {PrivyProvider} from '@privy-io/react-auth';
import { defineChain } from 'viem'
// let privy_key = import.meta.env.VITE_PRIVY_KEY;

export const inco = defineChain({
  id: 9090,
  name: 'Inco Gentry Testnet',
  network: 'Inco Gentry Testnet',
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
    default: { name: 'Explorer', url: 'https://explorer.testnet.inco.org/'},
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={"clsay39yw04tv13s57t7fig9f"}
      config={{
          loginMethods: ['email', 'google', 'discord', 'wallet'],
          defaultChain: inco,
          supportedChains: [inco],
          appearance: {
              theme: 'dark',
              accentColor: '#3673f5',
              logo: 'https://raw.githubusercontent.com/0xAkrasia/In-Theory-Games/main/src/images/sculpture_no_art.png',
              showWalletLoginFirst: false,
              walletList: ['coinbase_wallet', 'wallet_connect'],
          },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
)