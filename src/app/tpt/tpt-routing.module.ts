import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TptComponent } from './tpt/tpt.component';
import { TptResolver } from './tpt.resolver';
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
