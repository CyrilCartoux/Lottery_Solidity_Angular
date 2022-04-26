import { lottery_abi, lottery_address } from "src/abis_lottery";
import web3 from "./web3";
const lotteryContract = new web3.eth.Contract(lottery_abi, lottery_address);

export default lotteryContract;