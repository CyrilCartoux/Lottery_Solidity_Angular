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
  transactionHash: Subscription |undefined;
  winner$: Subscription|undefined;
  userEthAccounts: string[] = [];
  etherAmount:number = 0;
  players: any;
  managerAddress:any;
  contractBalance: any;
  userBalance: any;
  transactionPending: boolean = false;
  hash: any =null;
  winner : any;

  constructor(private contractService: ContractService) {}
  ngOnDestroy(): void {
    this.accounts?.unsubscribe();
    this.transactionHash?.unsubscribe();
    this.winner.unsubscribe();
  }

  ngOnInit(): void {
      this.contractService.connectAccount().then(()=> {
        this.contractService.getUserBalance().then((userBalance: any)=>this.userBalance=userBalance/1e18)
      })
   
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
    this.transactionHash = this.contractService.transactionHash.subscribe(hash => {
      this.hash = hash;
    })
    this.winner$ = this.contractService.winner.subscribe(winner => {
      this.winner = winner;
    })
  }

  onEnterLottery(amount: number) {
    this.transactionPending = true;
    this.contractService.enter(amount).then(result => {
      this.transactionPending = false;
    })
  }

  onPickWinner() {
    this.transactionPending = true;
    this.contractService.pickWinner().then(result => {
      this.transactionPending = false;
    })
  }
}
