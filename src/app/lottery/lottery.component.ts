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
  userBalance$: Subscription |undefined;
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
    this.winner$?.unsubscribe();
    this.userBalance$?.unsubscribe();
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
          this.winner = await this.contractService.getWinner()
          await this.contractService.getUserBalance();
        }
      }
    );
    this.transactionHash = this.contractService.transactionHash.subscribe(hash => {
      this.hash = hash;
    })
    this.winner$ = this.contractService.winner.subscribe(winner => this.winner = winner);
    this.userBalance$ = this.contractService.userBalance.subscribe(userBalance => this.userBalance = (userBalance/1e18));
  }
  
  /**
   * 
   * @param amount number ether sent by the user
   */
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

  /**
   * Manager choose a winner
   */
  onPickWinner() {
    this.transactionPending = true;
    this.contractService.pickWinner().then(winner => {
      this.transactionPending = false;
      this.winner = winner;
    })
  }
  
  /**
   * Manager steals the money
   */
  onTransfer() {
    this.transactionPending = true;
    this.contractService.transfer().then(() => {
      this.transactionPending = false;
    })
  }
}
