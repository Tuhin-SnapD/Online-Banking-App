/** Angular import */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Not Found Component */
import { NotFoundComponent } from './not-found/not-found.component';

/** Authentication Guard */
import { AuthenticationGuard } from './core/authentication/authentication.guard';

/**
 * Main application routes
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'transfers',
    loadChildren: () => import('./transfers/transfers.module').then(m => m.TransfersModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'tpt',
    loadChildren: () => import('./tpt/tpt.module').then(m => m.TptModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'beneficiaries',
    loadChildren: () => import('./beneficiaries/beneficiaries.module').then(m => m.BeneficiariesModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'recent-transactions',
    loadChildren: () => import('./recent-transactions/recent-transactions.module').then(m => m.RecentTransactionsModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'charges',
    loadChildren: () => import('./charges/charges.module').then(m => m.ChargesModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'loans',
    loadChildren: () => import('./loans/loans.module').then(m => m.LoansModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then(m => m.AboutUsModule),
    canActivate: [AuthenticationGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

/**
 * App Routing Module
 *
 * Configures all application routes with lazy loading and authentication guards.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    useHash: false,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule],
  providers: [AuthenticationGuard]
})
export class AppRoutingModule { }
