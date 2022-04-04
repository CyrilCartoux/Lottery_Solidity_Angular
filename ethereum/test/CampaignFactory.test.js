const assert = require("assert")
const ganache = require("ganache-cli")
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledKickStarterContract = require("../compile_kickstarter")
const compiledCampaignContract = require("../compile_campaign")

let kickstarter;
let accounts;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  kickstarter = await new web3.eth.Contract(compiledKickStarterContract.abi)
    .deploy({
      data: compiledKickStarterContract.evm.bytecode.object
    })
    .send({
      from: accounts[0],
      gas: "2500000"
    });

    await kickstarter.methods.createCampaign("Libellé", web3.utils.toWei('1', 'ether')).send({from: accounts[0], gas:'1000000'});
    [campaignAddress] = await kickstarter.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(compiledCampaignContract.abi, campaignAddress);
});

describe("CampaignFactory Contract", () => {
  it("deploys a contract", () => {
    assert.ok(kickstarter.options.address);
  });
  it("Creates a new Campaign", async() => {
      assert.ok(campaignAddress);
      assert.ok(campaign)
  })
  it('returns campaigns created', async() => {
      const campaigns = await kickstarter.methods.getDeployedCampaigns().call();
      assert.equal(campaigns.length, 1);
  })
  it('marks caller as the campaign manager', async() => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager)
  })
});
