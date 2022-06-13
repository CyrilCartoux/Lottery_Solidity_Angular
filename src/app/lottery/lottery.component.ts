import { EthUtils } from './../utils/eth-utils';
import { LotteryContractService } from '../services/lotteryContract.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { flatMap, mergeMap, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.less'],
})
export class LotteryComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  userEthAccount!: string;
  etherAmount: any = null;
  players: any;
  managerAddress: any;
  contractBalance: any;
  userBalance: any;
  transactionPending: boolean = false;
  hash: any = null;
  winner: any;
  enteredLottery: boolean = false;
  ethUtils: typeof EthUtils = EthUtils;
  newPlayerAdded: string | undefined;

  constructor(private lotteryContractService: LotteryContractService) { }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {

    this.subscriptions.add(
      this.lotteryContractService.getAccount()
        .subscribe((account: string) => {
          this.userEthAccount = account;
        })
    );
    this.subscriptions.add(
      this.lotteryContractService
        .getContractManager()
        .subscribe((manager) => (this.managerAddress = manager))
    );
    this.subscriptions.add(
      this.lotteryContractService
        .getContractBalance()
        .subscribe(
          (bal: number) =>
            (this.contractBalance = this.ethUtils.fromWeiToEth(bal))
        )
    );
    this.subscriptions.add(
      this.lotteryContractService
        .getPlayers()
        .subscribe((player) => (this.players = player))
    );
    this.subscriptions.add(
      this.lotteryContractService
        .getWinner()
        .subscribe((winner) => (this.winner = winner))
    );
    this.subscriptions.add(
      this.lotteryContractService.transactionHash$.subscribe((hash) => {
        this.hash = hash;
      })
    );
    this.subscriptions.add(
      this.lotteryContractService.winner$.subscribe((winner) => (this.winner = winner))
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
    this.lotteryContractService.pickWinner().subscribe((winner) => {
      this.transactionPending = false;
      this.winner = winner;
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
