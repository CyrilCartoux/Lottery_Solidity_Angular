import { EthUtils } from './../utils/eth-utils';
import { LotteryContractService } from '../services/lotteryContract.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Subscription,
  Observable,
  map,
} from 'rxjs';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.less'],
})
export class LotteryComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  etherAmount: any = null;

  userEthAccount$: Observable<string> | undefined;
  players$: Observable<string> | undefined;
  winner$: Observable<any> | undefined;
  managerAddress$: Observable<string> | undefined;
  contractBalance$: Observable<any> | undefined;

  hash: any = null;
  userBalance: any;
  transactionPending: boolean = false;
  enteredLottery: boolean = false;
  ethUtils: typeof EthUtils = EthUtils;
  newPlayerAdded: string | undefined;

  constructor(private lotteryContractService: LotteryContractService) {}
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.userEthAccount$ = this.lotteryContractService.getAccount();
    this.managerAddress$ = this.lotteryContractService.getContractManager();
    this.contractBalance$ = this.lotteryContractService
      .getContractBalance()
      .pipe(map((bal) => this.ethUtils.fromWeiToEth(bal)));

    this.players$ = this.lotteryContractService.getPlayers();
    this.winner$ = this.lotteryContractService.getWinner();

    this.subscriptions.add(
      this.lotteryContractService.transactionHash$.subscribe((hash) => {
        this.hash = hash;
      })
    );
    this.subscriptions.add(
      this.lotteryContractService.eventNewPlayer$.subscribe((player) => {
        this.newPlayerAdded = player;
      })
    );
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
