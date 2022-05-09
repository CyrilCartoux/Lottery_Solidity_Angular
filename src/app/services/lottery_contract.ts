import LotteryContract from '../../contracts/Lottery.json';
import web3 from "./web3";
const lotteryContract = new web3.eth.Contract(LotteryContract.abi, "0x41F1E33C769d5dcAFF2de7f6F8b267764E03677F");

export default lotteryContract;