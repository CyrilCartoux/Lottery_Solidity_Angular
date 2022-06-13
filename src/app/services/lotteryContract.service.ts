import { EthUtils } from './../utils/eth-utils';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, of, Subject, take } from 'rxjs';
import { web3 } from './web3';
import lotteryContract from './lottery_contract';

@Injectable({
  providedIn: 'root',
})
export class LotteryContractService {
  private web3js: any;
  private accounts: any;
  private lotteryContract: any;
  ethUtils: typeof EthUtils = EthUtils;

  private _transactionHash = new BehaviorSubject<any>(null);
  private _winner = new BehaviorSubject<any>(null);
  private _eventNewPlayer = new BehaviorSubject<any>(null);

  transactionHash$ = this._transactionHash.asObservable();
  winner$ = this._winner.asObservable();
  eventNewPlayer$ = this._eventNewPlayer.asObservable();

  constructor() {
    // create web3 instance
    this.web3js = web3;
    this.lotteryContract = lotteryContract;
    this.getAccount().subscribe((account) => {
      this.accounts = account;
    });
    this.filterEvents();
  }

  /**
   * Load connected account
   */
  public getAccount(): Observable<string> {
    return from(this.web3js.eth.getAccounts())
      .pipe(
        map((account) => { return (<string>account)[0] })
      )
  }

  /**
   * @returns Promise<string[]> List of all players
   */
  public getPlayers(): Observable<string> {
    if (this.accounts && this.accounts.length > 0) {
      return from<string[]>(
        this.lotteryContract?.methods
          .getPlayers()
          .call({ from: this.accounts })
      );
    }
    return of('');
  }

  /**
   * Enter a new player in the lottery
   */
  public enter(amount: number): Observable<any> {
    const updatedAmountInGwei = this.ethUtils.fromEthToWei(amount);
    return from(
      this.lotteryContract?.methods
        .enter()
        .send({ from: this.accounts, value: updatedAmountInGwei })
        .on('transactionHash', (hash: any) => {
          this._transactionHash.next(hash);
        })
    ).pipe(
      take(1),
      catchError((err) => of(null))
    );
  }

  /**
   * @returns balance of the contract in wei (/1e18 to have in ether)
   */
  public getContractBalance(): Observable<any> {
    return from(
      this.web3js.eth.getBalance(this.lotteryContract.options.address)
    );
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
  public getContractManager(): Observable<string> {
    return from<string>(this.lotteryContract.methods.manager().call());
  }

  /**
   * Manager picks a winner
   */
  public pickWinner(): Observable<any> {
    return from(
      this.lotteryContract.methods
        .pickWinner()
        .send({ from: this.accounts })
        .on('transactionHash', (hash: string) => {
          this._transactionHash.next(hash);
        })
    ).pipe(
      take(1),
      catchError((err) => {
        return of(null);
      })
    );
    // A REVOIR ( passer par EVENT WinnerPicked )
    // const winner = await this.lotteryContract.methods.previousWinner().call();
    // this._winner.next(winner);
    // return winner;
  }

  /**
   * emit balance of the user
   */
  public getUserBalance(): Observable<string> {
    return from(this.web3js.eth.getBalance(this.accounts))
      .pipe(
        map(bal => this.web3js.utils.fromWei(bal)))

  }

  /**
   * Steal the money
   */
  public transfer() {
    return from(
      this.lotteryContract.methods
        .transfer()
        .send({ from: this.accounts })
        .on('transactionHash', (hash: any) => {
          this._transactionHash.next(hash);
        })
    ).pipe(
      take(1),
      catchError((err) => {
        return of(null);
      })
    );
  }

  /**
   * @returns string winner
   */
  public getWinner(): Observable<string> {
    return from<string>(this.lotteryContract.methods.previousWinner().call());
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
