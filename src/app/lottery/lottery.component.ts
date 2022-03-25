import { LotteryContractService } from './../services/contract.service';
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
  winner$: Subscription |undefined;
  userEthAccounts: string[] = [];
  etherAmount:any = null;
  players: any;
  managerAddress:any;
  contractBalance: any;
  userBalance: any;
  transactionPending: boolean = false;
  hash: any =null;
  winner : any;

  constructor(private contractService: LotteryContractService) {}
  ngOnDestroy(): void {
    this.accounts?.unsubscribe();
    this.transactionHash?.unsubscribe();
  }

  ngOnInit(): void {
    setInterval(()=> {
      this.contractService.connectAccount()
      
    }, 3000)
   
    this.accounts = this.contractService.accountStatusSource.subscribe(
      async (accounts) => {
        if (accounts) {
          this.userEthAccounts = accounts;
          this.managerAddress = await this.contractService.getContractManager()
          this.contractBalance = (await this.contractService.getContractBalance())/1e18
          this.players = await this.contractService.getPlayers()
          this.userBalance = await this.contractService.getUserBalance()/1e18
          this.winner = await this.contractService.getWinner()
        }
      }
    );
    this.transactionHash = this.contractService.transactionHash.subscribe(hash => {
      this.hash = hash;
    })
    this.winner$ = this.contractService.winner.subscribe(winner => this.winner = winner);
  }

  onEnterLottery(amount: number) {
    this.transactionPending = true;
    this.contractService.enter(amount).then(result => {
      this.transactionPending = false;
    })
    .catch(err => {
      this.transactionPending = false;
    })
    this.etherAmount = null;
  }

  onPickWinner() {
    this.transactionPending = true;
    this.contractService.pickWinner().then(winner => {
      this.transactionPending = false;
      this.winner = winner;
    })
  }
  
  onTransfer() {
    this.transactionPending = true;
    this.contractService.transfer().then(() => {
      this.transactionPending = false;
    })
  }
}
