/** Angular Imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { AlertService } from '../core/alert/alert.service';
import { Alert } from '../core/alert/alert';

@Component({
  selector: 'online-banking-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  /** True if reset password component is on */
  resetPassword = false;
  /** Subscription to alerts */
  private alertSubscription: Subscription | null = null;

  /**
   * @param {AlertService} alertService Alert Service
   * @param {Router} router Navigation Router
   */
  constructor(
    private readonly alertService: AlertService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.alertSubscription = this.alertService.alertEvent.subscribe((alertEvent: Alert) => {
      const alertType = alertEvent.type;
      if (alertType === 'Authentication Success') {
        // Authentication success
        this.router.navigate(['/home'], { replaceUrl: true })
          .catch(error => {
            console.error('Navigation error:', error);
          });
      } else if (alertType === 'Password Reset Required') {
        this.resetPassword = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
      this.alertSubscription = null;
    }
  }
}
