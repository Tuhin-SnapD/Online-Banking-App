import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../../core/authentication/authentication.service';
import { AlertService } from '../../core/alert/alert.service';
import { Alert } from '../../core/alert/alert';

@Component({
  selector: 'online-banking-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  
  /** Reset Password Form Group */
  resetPasswordForm!: FormGroup;
  
  /** Loading state */
  isLoading = false;
  
  /** Password visibility toggle */
  passwordInputType = 'password';
  confirmPasswordInputType = 'password';
  
  /** Subscription to alerts */
  private alertSubscription: Subscription | null = null;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {AuthenticationService} authenticationService Authentication Service
   * @param {AlertService} alertService Alert Service
   * @param {Router} router Navigation Router
   */
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.createResetPasswordForm();
    this.alertSubscription = this.alertService.alertEvent.subscribe((alertEvent: Alert) => {
      if (alertEvent.type === 'Reset Password Success') {
        // Navigate back to login after successful reset
        setTimeout(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
        }, 2000);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
      this.alertSubscription = null;
    }
  }

  /**
   * Creates the reset password form
   */
  private createResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Submits the reset password form
   */
  resetPassword(): void {
    if (this.resetPasswordForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = this.resetPasswordForm.value;
      
      // Call the authentication service to reset password
      this.authenticationService.resetPassword(formData.email, formData.username, formData.newPassword)
        .subscribe({
          next: (success) => {
            this.isLoading = false;
            if (success) {
              this.alertService.alert({ 
                type: 'Reset Password Success', 
                message: 'Password reset successful! You will be redirected to login page.' 
              });
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Password reset error:', error);
            this.alertService.alert({ 
              type: 'Reset Password Error', 
              message: error.error?.defaultUserMessage || 'Password reset failed. Please try again.' 
            });
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Marks all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordInputType = this.confirmPasswordInputType === 'password' ? 'text' : 'password';
  }

  /**
   * Navigate back to login
   */
  backToLogin(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  /**
   * Get password strength indicator
   */
  getPasswordStrength(): { strength: string; color: string; percentage: number } {
    const password = this.resetPasswordForm.get('newPassword')?.value || '';
    
    if (!password) {
      return { strength: '', color: '', percentage: 0 };
    }

    let score = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/\d/.test(password)) score += 10;
    if (/[@$!%*?&]/.test(password)) score += 10;

    if (score >= 80) {
      return { strength: 'Strong', color: '#4caf50', percentage: score };
    } else if (score >= 60) {
      return { strength: 'Good', color: '#ff9800', percentage: score };
    } else if (score >= 40) {
      return { strength: 'Fair', color: '#ff5722', percentage: score };
    } else {
      return { strength: 'Weak', color: '#f44336', percentage: score };
    }
  }

  /**
   * Get form control error message
   */
  getErrorMessage(controlName: string): string {
    const control = this.resetPasswordForm.get(controlName);
    
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${requiredLength} characters`;
    }
    
    if (control?.hasError('pattern')) {
      if (controlName === 'newPassword') {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      }
    }
    
    if (this.resetPasswordForm.hasError('passwordMismatch') && controlName === 'confirmPassword') {
      return 'Passwords do not match';
    }
    
    return '';
  }

  /**
   * Password requirement validation methods
   */
  isPasswordLengthValid(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value || '';
    return password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value || '';
    return /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value || '';
    return /[@$!%*?&]/.test(password);
  }
}
