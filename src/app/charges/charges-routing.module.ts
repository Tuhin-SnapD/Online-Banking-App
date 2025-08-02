import { Routes, RouterModule } from '@angular/router';
import { ChargesListComponent } from './charges-list/charges-list.component';
import { extract } from '../core/i18n/i18n.service';
import { ChargesResolver } from './charges.resolver';
import { NgModule } from '@angular/core';




const routes: Routes = [
  {
    path: '',
    component: ChargesListComponent,
    data: { title: extract('Charges') },
    resolve: { charges: ChargesResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ChargesResolver]
})
export class ChargesRoutingModule { }
