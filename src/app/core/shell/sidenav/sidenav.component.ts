import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'online-banking-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  /** True if sidenav is in collapsed state. */
  @Input() sidenavCollapsed = false;
  
  /** Username of authenticated user. */
  username = 'Welcome';
  displayImage = '';

  /**
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication Service.
   */
  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) { }

  /**
   * Sets the username of the authenticated user.
   */
  ngOnInit(): void {
    const credentials = this.authenticationService.getCredentials();
    if (credentials) {
      this.username = credentials.username;
    }
  }

  // Profile picture display method - to be implemented
  // setDisplayImage() {
  //   this.sidenavService.getClientImage().subscribe((displayImage) => {
  //     this.displayImage = displayImage.toString();
  //   })
  // }

  /**
   * Logs out the authenticated user and redirects to login page.
   */
  logout(): void {
    this.authenticationService.logout()
      .subscribe({
        next: () => this.router.navigate(['/login'], { replaceUrl: true }),
        error: (error) => console.error('Logout error:', error)
      });
  }
}
