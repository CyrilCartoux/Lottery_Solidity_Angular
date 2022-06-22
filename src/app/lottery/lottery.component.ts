import { EthUtils } from './../utils/eth-utils';
import { LotteryContractService } from '../services/lotteryContract.service';
import { Component, OnInit } from '@angular/core';
import {
  Observable,
  map,
  take,
  tap,
  catchError,
  of
} from 'rxjs';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.less'],
})
export class LotteryComponent implements OnInit {
  etherAmount: any = null;

  userEthAccount$: Observable<string> | undefined;
  players$: Observable<string> | undefined;
  winner$: Observable<any> | undefined;
  managerAddress$: Observable<string> | undefined;
  contractBalance$: Observable<any> | undefined;
  hash$: Observable<any> | undefined
  newPlayerAdded$: Observable<string> | undefined;

  userBalance: any;
  transactionPending: boolean = false;
  enteredLottery: boolean = false;
  ethUtils: typeof EthUtils = EthUtils;

  constructor(private lotteryContractService: LotteryContractService) { }

  ngOnInit(): void {
    this.userEthAccount$ = this.lotteryContractService.getAccount();
    this.managerAddress$ = this.lotteryContractService.getContractManager();
    // pipe the observable and catch error
    this.hash$ = this.lotteryContractService.transactionHash$.pipe(
      tap(hash => {
        if (!hash) {
          this.transactionPending = false;
        }
      })
    );

    this.contractBalance$ = this.lotteryContractService
      .getContractBalance()
      .pipe(map((bal) => this.ethUtils.fromWeiToEth(bal)));
    this.players$ = this.lotteryContractService.getPlayers();
    this.winner$ = this.lotteryContractService.getWinner()
      .pipe(
        tap((winner) => {
          console.log('winner :>> ', winner);
        })
      )
    this.newPlayerAdded$ = this.lotteryContractService.eventNewPlayer$;
  }

  /**
   * @param amount number ether sent by the user
   */
  onEnterLottery(amount: number) {
    this.transactionPending = true;
    this.enteredLottery = false;
    this.lotteryContractService.enter(amount).subscribe((result) => {
      if (result) {
        this.transactionPending = false;
        this.enteredLottery = true;
        setTimeout(() => {
          !this.enteredLottery;
        }, 10000);
      }
    });
    this.etherAmount = null;
  }

  /**
   * Manager choose a winner
   */
  onPickWinner() {
    this.transactionPending = true;
    this.lotteryContractService.pickWinner().subscribe(() => {
      this.transactionPending = false;
    });
  }

  /**
   * Manager steals the money
   */
  onTransfer() {
    this.transactionPending = true;
    this.lotteryContractService.transfer().subscribe(() => {
      this.transactionPending = false;
    });
  }
}
