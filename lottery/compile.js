const path = require("path");
const fs = require("fs");
const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

const {interface, bytecode} = solc.compile(source, 1).contracts[":Lottery"];
// store the ABI + bytecode to a compiledContract.json file
const artifact = JSON.stringify({interface,bytecode}, null, 2);
fs.writeFileSync("compiledContract.json", artifact);

module.exports = {interface,bytecode}
