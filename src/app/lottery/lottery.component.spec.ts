import { of } from 'rxjs';
import { LotteryContractService } from './../services/lotteryContract.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LotteryComponent } from './lottery.component';

describe('LotteryComponent', () => {
  let component: LotteryComponent;
  let fixture: ComponentFixture<LotteryComponent>;
  const service: Partial<LotteryContractService> = {
    getAccount: () => of('0x0'),
    getPlayers: () => of('0x0'),
    // enter,
    getContractBalance: () => of('0.05'),
    getContractAddress: () => '0x41F1E33C769d5dcAFF2de7f6F8b267764E03677F',
    getContractManager: () => of('0xDAb03F750ef71F2888a32163A92d220FBF1cdA5F'),
    // pickWinner,
    // use it like this inside header test
    getUserBalance: () => of('0.25'),
    // transer,
    getWinner: () => of('0xBbfaa2fb032296a1619a56f5440bd89770456697'),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LotteryComponent],
    });
    fixture = TestBed.createComponent(LotteryComponent);
    component = fixture.componentInstance;
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
