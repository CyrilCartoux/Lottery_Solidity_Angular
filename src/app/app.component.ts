import { Router } from '@angular/router';
import { LotteryContractService } from './services/lotteryContract.service';
import { Component, OnInit } from '@angular/core';
import { connectAccount } from './services/web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  isConnected: boolean = false;
  constructor(private lotteryContractService: LotteryContractService, private router: Router) { }

  onConnectAccount() {
    connectAccount();
  }

  ngOnInit(): void {
    this.lotteryContractService.getAccount()
      .subscribe((acc: string) => {
        this.isConnected = acc ? true : false;
        if(this.isConnected) {
          this.router.navigate(['/lottery']);
        }
      });
  }

}
