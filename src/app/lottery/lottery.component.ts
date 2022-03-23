import { ContractService } from './../services/contract.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.less'],
})
export class LotteryComponent implements OnInit, OnDestroy {
  accounts: Subscription | undefined;
  userEthAccounts: string[] = [];
  etherAmount:number = 0;
  players: any;
  managerAddress:any;
  balance: any;

  constructor(private contractService: ContractService) {}
  ngOnDestroy(): void {
    this.accounts?.unsubscribe();
  }

  ngOnInit(): void {
    this.contractService.connectAccount();
    this.accounts = this.contractService.accountStatusSource.subscribe(
      (accounts) => {
        if (accounts) {
          this.userEthAccounts = accounts;
          this.contractService.getContractManager()
            .then(manager => this.managerAddress = manager)
          this.contractService.getContractBalance()
            .then(balance => this.balance = balance/1e18)
          this.contractService.getPlayers()
            .then(players => this.players = players)
        }
      }
    );
  }

  onEnterLottery(amount: number) {
    this.contractService.enter(amount);
  }

  onPickWinner() {
    this.contractService.pickWinner();
  }
}
