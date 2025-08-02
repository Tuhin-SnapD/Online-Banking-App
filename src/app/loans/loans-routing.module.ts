import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyLoanComponent } from './apply-loan/apply-loan.component';
import { ApplyLoanResolver } from './applyLoan.resolver';
import { extract } from '../core/i18n/i18n.service';

const routes: Routes = [
  {
    path: 'apply',
    component: ApplyLoanComponent,
    data: { title: extract('Apply for Loan') },
    resolve: { productOptions: ApplyLoanResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ApplyLoanResolver]
})
export class LoansRoutingModule { }
