const path = require("path");
const fs = require("fs");
const solc = require("solc");

const campaignFactoryPath = path.resolve(__dirname, "contracts", "kickstarter", "CampaignFactory.sol");
const campaignPath = path.resolve(__dirname, "contracts", "kickstarter", "Campaign.sol");
const campaignFactorySource = fs.readFileSync(campaignFactoryPath, "utf8");
const campaignSource = fs.readFileSync(campaignPath, "utf8");

const input = {
    language: 'Solidity',
    sources: {
      'CampaignFactory.sol': {
        content: campaignFactorySource,
      },
      'Campaign.sol': {
          content: campaignSource
      }
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
      'Campaign.sol'
    ].Campaign;
    const artifact = JSON.stringify({abi, evm}, null, 2);
    fs.writeFileSync("./build/compiledCampaignContract.json", artifact);
  
    module.exports = { abi, evm };

  } catch(err) {
     console.log(err)
  }

