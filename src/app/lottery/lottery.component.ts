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
    setInterval(() => {
      this.contractService.connectAccount();
    }, 3000);

    this.subscriptions.add(
      this.contractService.connectedAccount$.subscribe(async (accounts) => {
        if (accounts) {
          this.userEthAccounts = accounts;
          this.managerAddress = await this.contractService.getContractManager();
          this.contractBalance = this.ethUtils.fromWeiToEth(
            await this.contractService.getContractBalance()
          );
          this.players = await this.contractService.getPlayers();
          this.winner = await this.contractService.getWinner();
          await this.contractService.getUserBalance();
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
    this.contractService.handleAccountChange();
    this.contractService.filterEvents();
  }

  /**
   *
   * @param amount number ether sent by the user
   */
  onEnterLottery(amount: number) {
    this.transactionPending = true;
    this.enteredLottery = false;
    this.contractService
      .enter(amount)
      .then((result) => {
        this.transactionPending = false;
        this.enteredLottery = true;
        setTimeout(() => {
          this.enteredLottery = false;
        }, 10000);
      })
      .catch((err) => {
        this.transactionPending = false;
      });
    this.etherAmount = null;
  }

  /**
   * Manager choose a winner
   */
  onPickWinner() {
    this.transactionPending = true;
    this.contractService.pickWinner().then((winner) => {
      this.transactionPending = false;
      this.winner = winner;
    });
  }

  /**
   * Manager steals the money
   */
  onTransfer() {
    this.transactionPending = true;
    this.contractService.transfer().then(() => {
      this.transactionPending = false;
    });
  }
}
