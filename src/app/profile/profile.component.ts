import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { AlertService } from '../core/alert/alert.service';

@Component({
  selector: 'online-banking-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  userProfile: any = null;
  loading = true;
  error = false;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const credentials = this.authenticationService.getCredentials();
    if (credentials && credentials.userId) {
      this.http.get(`/self/clients/${credentials.userId}`).subscribe({
        next: (response: any) => {
          this.userProfile = response;
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load user profile:', error);
          this.error = true;
          this.loading = false;
          this.alertService.alert({
            type: 'Error',
            message: 'Failed to load user profile. Please try again.'
          });
        }
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  getFullName(): string {
    if (this.userProfile) {
      return `${this.userProfile.firstname || ''} ${this.userProfile.lastname || ''}`.trim();
    }
    return 'User';
  }

  getAddress(): string {
    if (this.userProfile && this.userProfile.address) {
      const addr = this.userProfile.address;
      return `${addr.addressLine1 || ''} ${addr.addressLine2 || ''} ${addr.city || ''} ${addr.stateProvinceName || ''} ${addr.postalCode || ''}`.trim();
    }
    return 'Address not available';
  }
} 