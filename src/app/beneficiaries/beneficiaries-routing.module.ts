import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiariesComponent } from './beneficiaries.component';
import { BeneficiariesResolver } from './beneficiaries.resolver';
import { extract } from '../core/i18n/i18n.service';

const routes: Routes = [
  {
    path: '',
    component: BeneficiariesComponent,
    data: { title: extract('Beneficiaries') },
    resolve: { beneficiaries: BeneficiariesResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BeneficiariesResolver]
})
export class BeneficiariesRoutingModule { }

