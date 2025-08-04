import { NgModule } from '@angular/core';

import { ApplyLoanComponent } from './apply-loan/apply-loan.component';
import { LoansRoutingModule } from './loans-routing.module';
import { ApplyLoanResolver } from './applyLoan.resolver';
import { SharedModule } from '../shared/shared.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [ApplyLoanComponent],
  imports: [
    LoansRoutingModule,
    SharedModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      timeOut: 2000,
      autoDismiss: true,
      progressBar: true,
      progressAnimation: 'increasing'
    })
  ],
  providers: [ApplyLoanResolver]
})
export class LoansModule { }
