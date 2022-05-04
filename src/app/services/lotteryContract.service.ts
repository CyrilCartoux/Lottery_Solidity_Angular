import { EthUtils } from './../utils/eth-utils';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import web3 from './web3';
import lotteryContract from './lottery_contract';

@Injectable({
  providedIn: 'root',
})
export class LotteryContractService {
  private web3js: any;
  private accounts: any;
  web3Modal: any;
  private lotteryContract: any;
  ethUtils: typeof EthUtils = EthUtils;

  private _connectedAccount = new BehaviorSubject<any>(null);
  private _transactionHash = new BehaviorSubject<any>(null);
  private _winner = new BehaviorSubject<any>(null);
  private _userBalance = new BehaviorSubject<any>(null);
  private _eventNewPlayer = new BehaviorSubject<any>(null);

  connectedAccount$ = this._connectedAccount.asObservable();
  transactionHash$ = this._transactionHash.asObservable();
  winner$ = this._winner.asObservable();
  userBalance$ = this._userBalance.asObservable();
  eventNewPlayer$ = this._eventNewPlayer.asObservable();

  constructor() {
    // create web3 instance
    this.web3js = web3;
    this.lotteryContract = lotteryContract;
  }

  /**
   * Load connected account
   */
  public async connectAccount() {
    this.accounts = await this.web3js.eth.getAccounts();
    this._connectedAccount.next(this.accounts);
  }

  /**
   * @returns Promise<string[]> List of all players
   */
  public async getPlayers(): Promise<string[]> {
    const players = await this.lotteryContract.methods
      .getPlayers()
      .call({ from: this.accounts[0] });
    return players;
  }

  /**
   * Enter a new player in the lottery
   */
  public async enter(amount: number): Promise<any> {
    const updatedAmountInGwei = this.ethUtils.fromEthToWei(amount);
    return await this.lotteryContract.methods
      .enter()
      .send({ from: this.accounts[0], value: updatedAmountInGwei })
      .on('transactionHash', (hash: any) => {
        this._transactionHash.next(hash);
      });
  }

  /**
   * @returns balance of the contract in wei (/1e18 to have in ether)
   */
  public async getContractBalance(): Promise<number> {
    const balance = await this.web3js.eth.getBalance(
      this.lotteryContract.options.address
    );
    return balance;
  }

  /**
   * @returns string contract address
   */
  public getContractAddress(): string {
    return this.lotteryContract.options.address;
  }

  /**
   * @returns string Manager of the contract
   */
  public async getContractManager(): Promise<string> {
    const manager = await this.lotteryContract.methods.manager().call();
    return manager;
  }

  /**
   * Manager picks a winner
   */
  public async pickWinner(): Promise<string> {
    await this.lotteryContract.methods
      .pickWinner()
      .send({ from: this.accounts[0] })
      .on('transactionHash', (hash: any) => {
        this._transactionHash.next(hash);
      });
    const winner = await this.lotteryContract.methods.previousWinner().call();
    this._winner.next(winner);
    return winner;
  }

  /**
   * emit balance of the user
   */
  public async getUserBalance(): Promise<void> {
    const balance = await this.web3js.eth.getBalance(this.accounts[0]);
    this._userBalance.next(balance);
  }

  /**
   * Steal the money
   */
  public async transfer(): Promise<void> {
    await this.lotteryContract.methods
      .transfer()
      .send({ from: this.accounts[0] })
      .on('transactionHash', (hash: any) => {
        this._transactionHash.next(hash);
      });
  }

  /**
   * @returns string winner
   */
  public async getWinner(): Promise<string> {
    const winner = await this.lotteryContract.methods.previousWinner().call();
    return winner;
  }

  public handleAccountChange() {
    if (window && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
        this.accounts = accounts;
        this._connectedAccount.next(this.accounts);
      });
    }
  }

  public filterEvents() {
    this.lotteryContract.events.PlayerAdded(
      { filter: {} },
      async (err: any, event: any) => {
        if (err) console.log(err);
        this._eventNewPlayer.next(event.returnValues._address);
      }
    );
  }
}
