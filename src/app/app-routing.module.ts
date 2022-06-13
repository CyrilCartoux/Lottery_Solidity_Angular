import { AuthGuard } from './guard/auth.guard';
import { LotteryComponent } from './lottery/lottery.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'lottery', canActivate: [AuthGuard],component: LotteryComponent, loadChildren: () => import('./lottery/lottery.module').then(m=> m.LotteryModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
