import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { SharedModule } from '../shared/shared.module';
import { IconsModule } from '../shared/icons.module';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ChangePasswordRoutingModule,
    IconsModule
  ]
})
export class ChangePasswordModule { } 