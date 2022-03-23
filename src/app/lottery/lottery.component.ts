import { ContractService } from './../services/contract.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.less']
})
export class LotteryComponent implements OnInit, OnDestroy {

  accounts: Subscription | undefined;
  userEthAccounts: string[] = [];

  constructor(
    private contractService: ContractService
  ) { }
  ngOnDestroy(): void {
    this.accounts?.unsubscribe();
  }

  ngOnInit(): void {
    this.contractService.connectAccount();
    this.accounts = this.contractService.accountStatusSource.subscribe((accounts) => {
      if(accounts) {
        this.userEthAccounts = accounts;
      }
    })
  }

}
