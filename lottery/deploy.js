require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const fs = require("fs");
const { interface, bytecode } = require('./compile');

// Store the ABI + bytecode to a demo.json file
const artifact = JSON.stringify({interface, bytecode}, null, 2);
fs.writeFileSync("DeployedContract.json", artifact);

const provider = new HDWalletProvider(
  process.env.MNEMONIC_PHRASE,
  // remember to change this to your own phrase!
  `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECTID}`
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
