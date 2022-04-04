require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const fs = require("fs");
const {abi,evm}=require('./compile_kickstarter');

// Store the ABI + evm to a demo.json file
const bytecode = evm.bytecode.object;
const artifact = JSON.stringify({abi, bytecode}, null, 2);
fs.writeFileSync("DeployedKickstarterContract.json", artifact);

const provider = new HDWalletProvider(
  process.env.MNEMONIC_PHRASE,
  // remember to change this to your own phrase!
  `https://rinkeby.infura.io/v3/${process.env.INFURA_KICKSTARTER_PROJECTID}`
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy KICKSTARTER from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: '2500000', from: accounts[0] });

  console.log('Contract KICKSTARTER deployed to', result.options.address);
  fs.appendFileSync('DeployedKickstarterContract.json', "'address:' "+result.options.address,"UTF8", {'flag':'a+'});
  provider.engine.stop();
};
deploy();

