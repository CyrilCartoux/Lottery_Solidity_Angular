import { LotteryContractService } from './../services/lotteryContract.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private lotteryContractService: LotteryContractService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let account$: Subject<boolean> = new Subject<boolean>();
    this.lotteryContractService.getAccount()
      .subscribe((account: string) => {
        if (account) {
          account$.next(true);
        }
        else {
          account$.next(false);
          this.router.navigate(['/']);
        }
      })
    return account$.asObservable();
  }

}
