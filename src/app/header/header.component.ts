import { EthUtils } from './../utils/eth-utils';
import { Subscription } from 'rxjs';
import { LotteryContractService } from '../services/lotteryContract.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userBalance$: Subscription | undefined;
  connectedAccount$: Subscription | undefined;
  account: string[] = [];
  userBalance: number | undefined;
  ethUtils: typeof EthUtils = EthUtils;

  constructor(private lotteryContractService: LotteryContractService) {}

  ngOnInit() {
    this.connectedAccount$ =
      this.lotteryContractService.connectedAccount$.subscribe(
        (accounts) => (this.account = accounts)
      );
    this.userBalance$ = this.lotteryContractService.userBalance$.subscribe(
      (userBalance) =>
        (this.userBalance = this.ethUtils.fromWeiToEth(userBalance))
    );
  }

  ngOnDestroy(): void {
    this.connectedAccount$?.unsubscribe();
    this.userBalance$?.unsubscribe();
  }
}
