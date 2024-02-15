import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {PrivyProvider} from '@privy-io/react-auth';
import { defineChain } from 'viem'
let privy_key = "clsay39yw04tv13s57t7fig9f"

export const inco = defineChain({
  id: 9090,
  name: 'Inco',
  network: 'Inco Network',
  nativeCurrency: {
    decimals: 18,
    name: 'Inco',
    symbol: 'INCO',
  },
  rpcUrls: {
    default: {
        http: ['https://evm-rpc.inco.network/']
    },
    public: {
        http: ['https://evm-rpc.inco.network/']
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.inco.network/' },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={privy_key}
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