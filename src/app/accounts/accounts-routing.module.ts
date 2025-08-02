import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsComponent } from './accounts.component';
import { AccountsResolver } from './accounts.resolver';
import { extract } from '../core/i18n/i18n.service';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    data: { title: extract('Accounts') },
    resolve: { accounts: AccountsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AccountsResolver]
})
export class AccountsRoutingModule { }

