import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TptComponent } from './third-party-transfer.component';
import { TptResolver } from './third-party-transfer.resolver';
import { extract } from '../core/i18n/i18n.service';

const routes: Routes = [
  {
    path: '',
    component: TptComponent,
    data: { title: extract('Third Party Transfer') },
    resolve: { template: TptResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TptResolver]
})
export class TptRoutingModule { }
