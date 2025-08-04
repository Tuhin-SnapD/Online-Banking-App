import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TptComponent } from './third-party-transfer.component';
import { ReviewTptDialogComponent } from './review-tpt-dialog/review-tpt-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { TptRoutingModule } from './third-party-transfer-routing.module';
import { TptService } from './third-party-transfer.service';

@NgModule({
  declarations: [TptComponent, ReviewTptDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    TptRoutingModule
  ],
  providers: [TptService]
})
export class ThirdPartyTransferModule { }
