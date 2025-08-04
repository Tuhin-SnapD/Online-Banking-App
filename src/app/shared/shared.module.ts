/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/** Custom Modules */
import { IconsModule } from './icons.module';
import { MaterialModule } from './material.module';

/** Custom Components */
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { FileSizePipe } from './pipes/file-size.pipe';

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
    LoadingSpinnerComponent,
    FileSizePipe
  ],
  exports: [
    CommonModule,
    IconsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    FileSizePipe
  ]
})
export class SharedModule { }
