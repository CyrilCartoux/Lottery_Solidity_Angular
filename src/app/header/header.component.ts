import { EthUtils } from './../utils/eth-utils';
import { from, Subscription, switchMap, tap } from 'rxjs';
import { LotteryContractService } from '../services/lotteryContract.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { connectAccount } from '../services/web3';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  account: string | undefined;
  userBalance: string | undefined;
  ethUtils: typeof EthUtils = EthUtils;

  constructor(private lotteryContractService: LotteryContractService) { }

  ngOnInit() {
    this.subscription.add(this.lotteryContractService.getAccount().pipe(
      switchMap((acc: string) => {
        this.account = acc.slice(0, 7).concat('...').concat(acc.slice(-6));
        return this.lotteryContractService.getUserBalance();
      })
    ).subscribe((balance) => {
      this.userBalance = balance.slice(0, 6);
    }))
  }

  onConnectAccount() {
    connectAccount();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
