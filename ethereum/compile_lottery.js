const path = require("path");
const fs = require("fs");
const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "contracts", "lottery", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

const input = {
    language: 'Solidity',
    sources: {
      'Lottery.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };
   
  try {
    const { abi, evm } = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
      'Lottery.sol'
    ].Lottery;
    const artifact = JSON.stringify({abi}, null, 2);
    fs.writeFileSync("compiledLotteryContract.json", artifact);
  
    module.exports = { abi, evm };

  } catch(err) {
     console.log(err)
  }

