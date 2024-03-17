const fs = require('fs');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "your-infura-api-key";
const mnemonic = fs.readFileSync('mne', { encoding: 'utf8' }).toString().trim();

module.exports = {
  networks: {
    inco: {
      provider: () => new HDWalletProvider(mnemonic, `https://testnet.inco.org`),
      network_id: 9090,
      gas: 5500000, // Set the gas usage limit to 2,852,890
      gasPrice: 15000000, // Set the gas price to 1,500,000,008 Wei
      confirmations: 2,
    },
    zama: {
      provider: () => new HDWalletProvider(mnemonic, `https://devnet.zama.ai`),
      network_id: 8009,
      gas: 5500000,
      gasPrice: 15000000,
      confirmations: 2,
    },
  },
  compilers: {
    solc: {
      version: "0.8.24", // Set the version to one in the required range
      // other solc settings like optimizer settings can go here
    }
  }
};
