import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'online-banking-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  /** Sets the initial state of sidenav as collapsed. Not collapsed if false. */
  sidenavCollapsed = false;

  // Toolbar properties
  username: string = '';
  userEmail: string = '';
  notificationCount: number = 0;
  notifications: any[] = [];

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint Observer to detect screen size.
   * @param {ChangeDetectorRef} cdr Change Detector Ref.
   * @param {AuthenticationService} authenticationService Authentication service.
   * @param {Router} router Router service.
   */
  constructor(private breakpointObserver: BreakpointObserver,
              private cdr: ChangeDetectorRef,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  /**
   * Subscribes to progress bar to update its mode.
   */
  ngOnInit() {
    this.loadUserData();
    this.loadNotifications();
  }

  /**
   * Toggles the current collapsed state of sidenav according to the emitted event.
   * @param {boolean} event denotes state of sidenav
   */
  toggleCollapse($event: boolean) {
    this.sidenavCollapsed = $event;
    this.cdr.detectChanges();
  }

  /**
   * Toggles the sidenav visibility
   */
  toggleSidenav() {
    // This will be handled by the sidenav component
  }

  /**
   * Loads user data for the navbar
   */
  private loadUserData() {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username || 'User';
      this.userEmail = currentUser.email || 'user@example.com';
    }
  }

  /**
   * Loads notifications for the navbar
   */
  private loadNotifications() {
    // Mock notifications - replace with actual service call
    this.notifications = [
      {
        id: 1,
        title: 'Account Update',
        message: 'Your account has been successfully updated.',
        type: 'info',
        read: false,
        createdAt: new Date()
      },
      {
        id: 2,
        title: 'Transaction Completed',
        message: 'Your transfer of $500 has been completed.',
        type: 'success',
        read: true,
        createdAt: new Date(Date.now() - 3600000)
      }
    ];
    this.notificationCount = this.notifications.filter(n => !n.read).length;
  }

  /**
   * Marks a notification as read
   */
  markNotificationAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.notificationCount = this.notifications.filter(n => !n.read).length;
    }
  }

  /**
   * Gets the appropriate icon for notification type
   */
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      default: return 'info-circle';
    }
  }

  /**
   * Logs out the user
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
