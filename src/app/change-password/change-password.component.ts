import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { AlertService } from '../core/alert/alert.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'online-banking-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  
  changePasswordForm!: FormGroup;
  loading = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordStrengthValidator() {
    return (control: any) => {
      const password = control.value;
      if (!password) return null;
      
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      const valid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
      
      return valid ? null : { passwordStrength: true };
    };
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  getPasswordStrength(): string {
    const password = this.changePasswordForm.get('newPassword')?.value;
    if (!password) return '';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return '#f44336';
      case 'medium': return '#ff9800';
      case 'strong': return '#4caf50';
      default: return '#ccc';
    }
  }

  changePassword(): void {
    if (this.changePasswordForm.valid) {
      this.loading = true;
      const credentials = this.authenticationService.getCredentials();
      
      if (credentials && credentials.userId) {
        const formData = this.changePasswordForm.value;
        
        this.http.post(`/self/users/${credentials.userId}/password`, {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }).subscribe({
          next: (response: any) => {
            this.loading = false;
            this.snackBar.open('Password changed successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            
            // Clear form
            this.changePasswordForm.reset();
            
            // Navigate back to profile or home
            this.router.navigate(['/profile']);
          },
          error: (error) => {
            this.loading = false;
            console.error('Failed to change password:', error);
            
            let errorMessage = 'Failed to change password. Please try again.';
            if (error.error?.defaultUserMessage) {
              errorMessage = error.error.defaultUserMessage;
            }
            
            this.alertService.alert({
              type: 'Error',
              message: errorMessage
            });
          }
        });
      } else {
        this.loading = false;
        this.alertService.alert({
          type: 'Error',
          message: 'User not authenticated. Please login again.'
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.changePasswordForm.controls).forEach(key => {
      const control = this.changePasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.changePasswordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      if (field.errors['minlength']) return `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['passwordStrength']) return 'Password must contain uppercase, lowercase, number, and special character';
    }
    return '';
  }

  getFormError(): string {
    if (this.changePasswordForm.errors?.['passwordMismatch'] && this.changePasswordForm.get('confirmPassword')?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  // Password requirement check methods
  hasUpperCase(): boolean {
    const password = this.changePasswordForm.get('newPassword')?.value;
    return password ? /[A-Z]/.test(password) : false;
  }

  hasLowerCase(): boolean {
    const password = this.changePasswordForm.get('newPassword')?.value;
    return password ? /[a-z]/.test(password) : false;
  }

  hasNumber(): boolean {
    const password = this.changePasswordForm.get('newPassword')?.value;
    return password ? /\d/.test(password) : false;
  }

  hasSpecialChar(): boolean {
    const password = this.changePasswordForm.get('newPassword')?.value;
    return password ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : false;
  }

  hasMinLength(): boolean {
    const password = this.changePasswordForm.get('newPassword')?.value;
    return password ? password.length >= 8 : false;
  }
} 