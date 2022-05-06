import { LotteryContractService } from './../services/lotteryContract.service';
import { LotteryComponent } from './lottery.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [LotteryComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [LotteryContractService]
})
export class LotteryModule { }
