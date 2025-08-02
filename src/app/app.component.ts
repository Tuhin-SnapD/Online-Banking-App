import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './core/authentication/authentication.service';

@Component({
  selector: 'online-banking-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  isAuthenticated = false;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    // Check authentication status
    this.isAuthenticated = this.authenticationService.isAuthenticated();
    
    // Listen for authentication changes
    this.authenticationService.authenticationState$.subscribe(
      (authenticated: boolean) => {
        this.isAuthenticated = authenticated;
      }
    );
  }
}
