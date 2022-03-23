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
  contractBalance: any;
  userBalance: any;

  constructor(private contractService: ContractService) {}
  ngOnDestroy(): void {
    this.accounts?.unsubscribe();
  }

  ngOnInit(): void {
    setInterval(()=> {
      this.contractService.connectAccount().then(()=> {
        this.contractService.getUserBalance().then((userBalance: any)=>this.userBalance=userBalance/1e18)
      })
    },1000);
   
    this.accounts = this.contractService.accountStatusSource.subscribe(
      (accounts) => {
        if (accounts) {
          this.userEthAccounts = accounts;
          this.contractService.getContractManager()
            .then(manager => this.managerAddress = manager)
          this.contractService.getContractBalance()
            .then(contractBalance => this.contractBalance = contractBalance/1e18)
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
