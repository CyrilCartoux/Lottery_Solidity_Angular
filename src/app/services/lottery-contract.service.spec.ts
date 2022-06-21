import { TestBed } from '@angular/core/testing';
import { LotteryContractService } from './lotteryContract.service';

describe('LotteryContractService', () => {
  let service: LotteryContractService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LotteryContractService],
    });
    service = TestBed.inject(LotteryContractService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
