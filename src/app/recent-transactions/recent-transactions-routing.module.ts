import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentTransactionsComponent } from './recent-transactions/recent-transactions.component';
import { RecentTransactionsResolver } from './recent-transactions.resolver';
import { extract } from '../core/i18n/i18n.service';

const routes: Routes = [
  {
    path: '',
    component: RecentTransactionsComponent,
    data: { title: extract('Recent Transactions') },
    resolve: { transactions: RecentTransactionsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RecentTransactionsResolver]
})
export class RecentTransactionsRoutingModule { }

