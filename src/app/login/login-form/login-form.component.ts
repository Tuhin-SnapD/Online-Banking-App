import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** rxjs Imports */
import { finalize } from 'rxjs/operators';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { AlertService } from '../../core/alert/alert.service';

@Component({
  selector: 'online-banking-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  /** Login Form Group */
  loginForm!: UntypedFormGroup;
  passwordInputType = 'password';
  loading = false;
  matcher = new ErrorStateMatcher();

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {AuthenticationService} authenticationService Authentication Service
   * @param {AlertService} alertService Alert Service
   */
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly alertService: AlertService
  ) { }

  /**
   * Create Login Form
   * Initialize password input field type
   */
  ngOnInit(): void {
    this.createLoginForm();
  }

  /**
   * Authenticate user credentials
   */
  login(): void {
    if (this.loginForm.invalid) {
      this.alertService.alert({ 
        type: 'Validation Error', 
        message: 'Please fill in all required fields.' 
      });
      return;
    }

    this.loading = true;
    this.loginForm.disable();
    
    this.authenticationService.login(this.loginForm.value)
      .pipe(finalize(() => {
        this.loading = false;
        this.loginForm.enable();
      }))
      .subscribe({
        next: () => {
          // Login successful
          this.loginForm.reset();
          this.loginForm.markAsPristine();
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.alertService.alert({ 
            type: 'Authentication Error', 
            message: 'Login failed. Please check your credentials and try again.' 
          });
        }
      });
  }

  /**
   * Display the forgot password component
   */
  forgotPassword(): void {
    this.alertService.alert({ 
      type: 'Password Reset Required', 
      message: 'Password reset functionality is not yet implemented.' 
    });
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
  }

  /**
   * Create Login Form
   */
  private createLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
