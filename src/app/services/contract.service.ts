import { Injectable } from '@angular/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BehaviorSubject, Subject } from 'rxjs';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { lottery_abi, lottery_address } from 'src/abis';

@Injectable({
  providedIn: 'root',
})
export class LotteryContractService {
  private web3js: any;
  private provider: any;
  private accounts: any;
  web3Modal: any;
  private lotteryContract: any;

  public accountStatusSource = new Subject<any>();
  public transactionHash = new BehaviorSubject<any>(null);
  public winner = new Subject<any>();
  public userBalance = new BehaviorSubject<any>(null);

  constructor() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: 'ef7e07ecb9a94f5d9de70961f16b77d6',
        },
      },
    };
    this.web3Modal = new Web3Modal({
      network: 'rinkeby',
      cacheProvider: true,
      providerOptions: providerOptions,
      theme: {
        background: 'rgb(39, 49, 56)',
        main: 'rgb(199, 199, 199)',
        secondary: 'rgb(136, 136, 136)',
        border: 'rgba(195, 195, 195, 0.14)',
        hover: 'rgb(16, 26, 32)',
      },
    });
  }

  /**
   * create a new web3 instance and passes it to accountStatusSource
   */
  public async connectAccount() {
    // set provider
    this.provider = await this.web3Modal.connect();
    // create web3 instance
    this.web3js = new Web3(this.provider);
    this.accounts = await this.web3js.eth.getAccounts();
    this.accountStatusSource.next(this.accounts);
  }

  /**
   * 
   * @returns Promise<string[]> List of all players
   */
  public async getPlayers(): Promise<string[]> {
    this.instantianteContract();
    const players = await this.lotteryContract.methods.getPlayers().call({from: this.accounts[0]});
    return players;
  }

  /**
   * Enter a new player in the lottery
   */
  public async enter(amount:number) {
    this.instantianteContract();
    const updatedAmountInGwei = amount * 1e18;
    return await this.lotteryContract.methods.enter().send({from: this.accounts[0], value: updatedAmountInGwei})
      .on("transactionHash", (hash: any)=> {
        this.transactionHash.next(hash);
      })
  }

  /**
   * 
   * @returns balance of the contract in wei (/1e18 to have in ether)
   */
  public async getContractBalance() {
    const balance = await this.web3js.eth.getBalance(this.lotteryContract.options.address);
    return balance;
  }

  /**
   * 
   * @returns string contract address
   */
  public async getContractAddress() {
    return this.lotteryContract.options.address;
  }

  /**
   * 
   * @returns string Manager of the contract
   */
  public async getContractManager() {
    this.instantianteContract();
    const manager = await this.lotteryContract.methods.manager().call();
    return manager;
  }

  /**
   * Manager picks a winner
   */
  public async pickWinner() {
    this.instantianteContract();
    await this.lotteryContract.methods.pickWinner().send({from:this.accounts[0]})
    const winner = await this.lotteryContract.methods.previousWinner().call(); 
    this.winner.next(winner);
    return winner;
  }
  
  /**
   * emit balance of the user
   */
  public async getUserBalance() {
    const balance = await this.web3js.eth.getBalance(this.accounts[0]);
    this.userBalance.next(balance);
  }
  
  /**
   * Steal the money
   */
  public async transfer() {
    this.instantianteContract();
    await this.lotteryContract.methods.transfer().send({from: this.accounts[0]})
    .on('transactionHash', ((hash: any) => {
      this.transactionHash.next(hash)
    }))
  }
  
  /**
   * 
   * @returns string winner
   */
  public async getWinner() {
    this.instantianteContract();
    const winner = await this.lotteryContract.methods.previousWinner().call(); 
    return winner;
  }
  
  private instantianteContract() {
    this.lotteryContract = new this.web3js.eth.Contract(lottery_abi, lottery_address);
  }
}
