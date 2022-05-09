require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.MNEMONIC_PHRASE;

module.exports = {
  contracts_build_directory: "../src/contracts",

  networks: {
    rinkeby: {
      provider: () => {
        const project_id = process.env.INFURA_LOTTERY_PROJECTID;
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${project_id}`);
      },
      network_id: 4
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.11", 
    }
  },
};
