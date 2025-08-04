import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsComponent } from './accounts.component';
import { AccountsResolver } from './accounts.resolver';
import { AccountStatementsComponent } from './account-statements/account-statements.component';
import { StandingInstructionsComponent } from './standing-instructions/standing-instructions.component';
import { extract } from '../core/i18n/i18n.service';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    data: { title: extract('Accounts') },
    resolve: { accounts: AccountsResolver }
  },
  {
    path: 'statements',
    component: AccountStatementsComponent,
    data: { title: extract('Account Statements') }
  },
  {
    path: 'statements/:accountType/:accountId',
    component: AccountStatementsComponent,
    data: { title: extract('Account Statements') }
  },
  {
    path: 'standing-instructions',
    component: StandingInstructionsComponent,
    data: { title: extract('Standing Instructions') }
  },
  {
    path: 'standing-instructions/:accountType/:accountId',
    component: StandingInstructionsComponent,
    data: { title: extract('Standing Instructions') }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AccountsResolver]
})
export class AccountsRoutingModule { }

