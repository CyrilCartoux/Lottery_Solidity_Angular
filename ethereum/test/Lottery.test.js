const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const {shouldThrow} = require("./utils/helper");

const { abi, evm } = require("../compile_lottery");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });
});
describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[1], players[0]);
    assert.equal(1, players.length);
  });

  it("allows multiple accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[1], players[0]);
    assert.equal(accounts[2], players[1]);
    assert.equal(accounts[3], players[2]);
    assert.equal(3, players.length);
  });

  it("requires a minimum amount of ether to enter", async () => {
    await shouldThrow(lottery.methods.enter().send({
      from: accounts[1],
      value: 0,
    }))
  });

  it("only manager can call pickWinner", async () => {
    await shouldThrow(lottery.methods.pickWinner().send({from: accounts[1]}))
  });

  it("sends money to the winner and resets the players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;
    
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
  it("should emit an event when a player is added", async() => {
    await lottery.methods.enter().send({from: accounts[1], value: web3.utils.toWei("1", "ether")});
    lottery.events.PlayerAdded(
      { filter: {} },
      async (err, event) => {
        if (err) return false;
        assert.ok(event.returnValues._address);
      }
    );
  });
  it("should emit an event when a winner has been picked", async() => {
    await lottery.methods.enter().send({from: accounts[1], value: web3.utils.toWei("1", "ether")});
    const contractBalance = await web3.eth.getBalance(lottery.options.address);
    const initialWinnerBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.pickWinner().send({from: accounts[0]});
    const finalWinnerBalance = await web3.eth.getBalance(accounts[1]);
    lottery.events.WinnerPicked(
      {filter: {}},
      async(err, event) => {
        if(err) return false;
        // ethwon must be equal to contract balance
        assert(finalWinnerBalance - initialWinnerBalance == event.returnValues._ethWon);
        assert.ok(event.returnValues._address);
        assert(event.returnValues._address == accounts[1]);
      }
    )
  });
  
  it("should transfer contract balance to manager ;-) ", async ()=> {
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.enter().send({from: accounts[1], value: web3.utils.toWei('2', 'ether')})
    await lottery.methods.transfer().send({ from: accounts[0] });
    
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));

  })
  it("should return the previous winner", async() => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const winner = await lottery.methods.previousWinner().call();
    assert.equal(accounts[1], winner);
  })
});
