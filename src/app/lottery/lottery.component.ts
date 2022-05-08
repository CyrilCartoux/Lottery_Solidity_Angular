import { EthUtils } from './../utils/eth-utils';
import { LotteryContractService } from '../services/lotteryContract.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.less'],
})
export class LotteryComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  userEthAccounts: string[] = [];
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

  constructor(private contractService: LotteryContractService) {}
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.contractService.connectAccount();

    this.subscriptions.add(
      this.contractService.connectedAccount$.subscribe((accounts) => {
        if (accounts) {
          this.userEthAccounts = accounts;
          this.contractService.getUserBalance();
          this.subscriptions.add(
            this.contractService
              .getContractManager()
              .subscribe((manager) => (this.managerAddress = manager))
          );
          this.subscriptions.add(
            this.contractService
              .getContractBalance()
              .subscribe(
                (bal: number) =>
                  (this.contractBalance = this.ethUtils.fromWeiToEth(bal))
              )
          );
          this.subscriptions.add(
            this.contractService
              .getPlayers()
              .subscribe((player) => (this.players = player))
          );
          this.subscriptions.add(
            this.contractService
              .getWinner()
              .subscribe((winner) => (this.winner = winner))
          );
        }
      })
    );
    this.subscriptions.add(
      this.contractService.transactionHash$.subscribe((hash) => {
        this.hash = hash;
      })
    );
    this.subscriptions.add(
      this.contractService.winner$.subscribe((winner) => (this.winner = winner))
    );
    this.subscriptions.add(
      this.contractService.userBalance$.subscribe(
        (userBalance) =>
          (this.userBalance = this.ethUtils.fromWeiToEth(userBalance))
      )
    );
    this.subscriptions.add(
      this.contractService.eventNewPlayer$.subscribe((player) => {
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
    this.contractService.enter(amount).subscribe((result) => {
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
    this.contractService.pickWinner().subscribe((winner) => {
      this.transactionPending = false;
      this.winner = winner;
    });
  }

  /**
   * Manager steals the money
   */
  onTransfer() {
    this.transactionPending = true;
    this.contractService.transfer().subscribe(() => {
      this.transactionPending = false;
    });
  }
}
