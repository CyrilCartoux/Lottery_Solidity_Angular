const Lottery = artifacts.require("Lottery");
const {
  shouldThrow
} = require("./utils/helper");
contract("Lottery", (accounts) => {
  // for better visibily 
  let [alice, bob, paul, john] = accounts;
  let instance;
  beforeEach(async () => {
    // reuse same contract
    // instance = await Lottery.deployed();
    // creates a new contract each time
    instance = await Lottery.new();
  });
  it("has been deployed ", async () => {
    assert(instance, "Contract has been deployed");
  })
  it("should allow one account to enter", async () => {
    await instance.enter({
      from: bob,
      value: web3.utils.toWei("1", "ether")
    });
    const players = await instance.getPlayers();
    assert.equal(1, players.length);
  });
  it("Alice is the manager of the contract ?", async () => {
    const manager = await instance.manager();
    assert.equal(alice, manager);
  });
  it("allows multiple accounts to enter", async () => {
    await instance.enter({
      from: bob,
      value: web3.utils.toWei('1', 'ether')
    });
    await instance.enter({
      from: paul,
      value: web3.utils.toWei('1', 'ether')
    });
    const players = await instance.getPlayers();
    assert.equal(players[0], bob);
    assert.equal(players[1], paul);
    assert.equal(players.length, 2);
  });
  it("requires a minimum ether to enter", async () => {
    await shouldThrow(instance.enter({
      from: alice
    }));
  });
  // only manager can call pickWinner
  it("only manager can pick a winner", async () => {
    await instance.enter({
      from: bob,
      value: web3.utils.toWei('1', 'ether')
    });
    await shouldThrow(instance.pickWinner({
      from: bob
    }));
  })
  // sends money to the winner and resets the players array
  it("should send money to the winner and reset the players array", async () => {
    await instance.enter({
      from: bob,
      value: web3.utils.toWei("2", "ether")
    });
    const initialBalance = await web3.eth.getBalance(bob);

    await instance.pickWinner({
      from: alice
    });
    const finalBalance = await web3.eth.getBalance(bob);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
  // should emit an event when a player is added
  it("should emit an event when a new player is added", async () => {
    await instance.enter({
      from: bob,
      value: web3.utils.toWei("2", "ether")
    });
    instance.PlayerAdded({
      filter: {}
    }, async (err, value) => {
      if (err) return false;
      assert.ok(value.returnValues._address);
    })
  });
  // should emit an event when a winner has been picked
  it("should emit an event when a winner is picked", async () => {
    await instance.enter({
      from: bob,
      value: web3.utils.toWei("2", "ether")
    });
    const initialWinnerBalance = await web3.eth.getBalance(bob);
    await instance.pickWinner({
      from: alice
    });
    const finalWinnerBalance = await web3.eth.getBalance(bob);
    instance.WinnerPicked({
        filter: {}
      },
      async (err, event) => {
        if (err) return false;
        // ethwon must be equal to contract balance
        assert(finalWinnerBalance - initialWinnerBalance == event.returnValues._ethWon);
        assert.ok(event.returnValues._address);
        assert(event.returnValues._address == bob);
      }
    )

  });

  it("should transfer contract balance to manager ;-) ", async () => {
    const initialBalance = await web3.eth.getBalance(alice);
    await instance.enter({
      from: bob,
      value: web3.utils.toWei('2', 'ether')
    });
    await instance.transfer({
      from: alice
    });

    const finalBalance = await web3.eth.getBalance(alice);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});
