import { EthUtils } from './../utils/eth-utils';
import { Subscription } from 'rxjs';
import { LotteryContractService } from '../services/lotteryContract.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { connectAccount } from '../services/web3';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userBalance$: Subscription | undefined;
  connectedAccount$: Subscription | undefined;
  account: string | undefined;
  userBalance: number | undefined;
  ethUtils: typeof EthUtils = EthUtils;

  constructor(private lotteryContractService: LotteryContractService) { }

  ngOnInit() {
    this.connectedAccount$ =
      this.lotteryContractService.connectedAccount$.subscribe(
        (acc: string) => (this.account = acc.slice(0, 7).concat('...').concat(acc.slice(-6)))
      );
    this.userBalance$ = this.lotteryContractService.userBalance$.subscribe(
      (userBalance) =>
        (this.userBalance = userBalance.slice(0, 6))
    );
  }

  onConnectAccount() {
    connectAccount();
  }

  ngOnDestroy(): void {
    this.connectedAccount$?.unsubscribe();
    this.userBalance$?.unsubscribe();
  }
}
