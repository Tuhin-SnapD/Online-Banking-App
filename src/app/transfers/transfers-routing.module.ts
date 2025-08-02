import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransfersComponent } from './transfers.component';
import { TransfersResolver } from './transfers.resolver';
import { extract } from '../core/i18n/i18n.service';

const routes: Routes = [
  {
    path: '',
    component: TransfersComponent,
    data: { title: extract('Transfers') },
    resolve: { transferTemplate: TransfersResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TransfersResolver]
})
export class TransfersRoutingModule { }

