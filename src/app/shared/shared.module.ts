/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/** Custom Modules */
import { IconsModule } from './icons.module';
import { MaterialModule } from './material.module';

/** Custom Components */
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

/**
 * Shared Modules
 *
 * Modules and Components shared throughout the Application
 */
@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoadingSpinnerComponent
  ],
  exports: [
    CommonModule,
    IconsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }
