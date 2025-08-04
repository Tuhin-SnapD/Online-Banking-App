import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { AlertService } from '../core/alert/alert.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'online-banking-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  
  settingsForm!: FormGroup;
  userSettings: any = null;
  loading = true;
  saving = false;
  loadingError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadUserSettings();
  }

  createForm(): void {
    this.settingsForm = this.fb.group({
      language: ['en', Validators.required],
      timezone: ['America/New_York', Validators.required]
    });
  }

  loadUserSettings(): void {
    this.loading = true;
    this.loadingError = false;
    this.errorMessage = '';
    
    const credentials = this.authenticationService.getCredentials();
    
    if (!credentials) {
      this.loading = false;
      this.loadingError = true;
      this.errorMessage = 'Authentication required. Please log in again.';
      this.alertService.alert({
        type: 'Error',
        message: 'Authentication required. Please log in again.'
      });
      return;
    }
    
    if (!credentials.userId) {
      this.loading = false;
      this.loadingError = true;
      this.errorMessage = 'User ID not found. Please log in again.';
      this.alertService.alert({
        type: 'Error',
        message: 'User ID not found. Please log in again.'
      });
      return;
    }
    
    const apiUrl = `/self/users/${credentials.userId}/settings`;
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      this.loading = false;
      this.loadingError = true;
      this.errorMessage = 'Request timed out. Please try again.';
      this.alertService.alert({
        type: 'Error',
        message: 'Request timed out. Please try again.'
      });
      // Initialize with default values as fallback
      this.initializeWithDefaultValues();
    }, 10000); // 10 second timeout
    
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        clearTimeout(timeout);
        this.userSettings = response;
        
        try {
          // Transform the response to match the form structure if needed
          const transformedResponse = this.transformResponseToFormStructure(response);
          
          this.settingsForm.patchValue(transformedResponse);
        } catch (error) {
          console.error('SettingsComponent.loadUserSettings(): Error patching form:', error);
        }
        
        this.loading = false;
        this.loadingError = false;
        
        // Force change detection
        this.cdr.detectChanges();
      },
      error: (error) => {
        clearTimeout(timeout);
        console.error('SettingsComponent.loadUserSettings(): Error:', error);

        this.loading = false;
        this.loadingError = true;
        
        // Handle specific error cases
        if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
          this.alertService.alert({
            type: 'Error',
            message: 'Authentication failed. Please log in again.'
          });
        } else if (error.status === 404) {
          this.errorMessage = 'Settings not found. Please contact support.';
          this.alertService.alert({
            type: 'Error',
            message: 'Settings not found. Please contact support.'
          });
          // Initialize with default values as fallback
          this.initializeWithDefaultValues();
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection and try again.';
          this.alertService.alert({
            type: 'Error',
            message: 'Unable to connect to server. Please check your connection and try again.'
          });
          // Initialize with default values as fallback
          this.initializeWithDefaultValues();
        } else {
          this.errorMessage = `Failed to load user settings: ${error.status} ${error.statusText}. Please try again.`;
          this.alertService.alert({
            type: 'Error',
            message: `Failed to load user settings: ${error.status} ${error.statusText}. Please try again.`
          });
          // Initialize with default values as fallback
          this.initializeWithDefaultValues();
        }
      }
    });
  }

  retryLoadSettings(): void {
    this.loadUserSettings();
  }

  private transformResponseToFormStructure(response: any): any {
    // Simple transformation for basic form
    const transformed = {
      language: response.language || 'en',
      timezone: response.timezone || 'America/New_York'
    };
    
    return transformed;
  }

  private initializeWithDefaultValues(): void {
    const defaultSettings = {
      language: 'en',
      timezone: 'America/New_York'
    };
    
    this.userSettings = defaultSettings;
    this.settingsForm.patchValue(defaultSettings);
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      this.saving = true;
      
      // For now, just simulate saving
      setTimeout(() => {
        this.saving = false;
        this.snackBar.open('Settings saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }, 1000);
    } else {
      this.alertService.alert({
        type: 'Error',
        message: 'Please fix the form errors before saving.'
      });
    }
  }


} 