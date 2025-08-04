import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { HttpClient } from '@angular/common/http';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'online-banking-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ToolbarComponent implements OnInit, OnDestroy {

  /** Subscription to breakpoint observer for handset. */
  readonly isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  
  /** Side Navigation Collapse Event */
  sidenavCollapsed = false;
  
  /** User information */
  username = 'User';
  userEmail = 'user@example.com';
  currentPage = 'Dashboard';
  notificationCount = 0;
  notifications: any[] = [];

  /** Instance of side navigation drawer */
  @Input() sidenav!: MatSidenav;
  
  /** Sidenav Collapse Event emitter */
  @Output() collapse = new EventEmitter<boolean>();

  private handsetSubscription: Subscription | null = null;

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint Observer to detect screen size.
   * @param {Router} router Router
   * @param {AuthenticationService} authenticationService Authentication Service
   * @param {HttpClient} http HttpClient for API calls
   * @param {MatSnackBar} snackBar SnackBar for notifications
   */
  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Get user information
    const credentials = this.authenticationService.getCredentials();
    if (credentials) {
      this.username = credentials.username || 'User';
      this.userEmail = credentials.email || 'user@example.com';
    }

    // Load notifications
    this.loadNotifications();

    // Set up handset subscription
    this.handsetSubscription = this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.sidenavCollapsed = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.handsetSubscription) {
      this.handsetSubscription.unsubscribe();
    }
  }

  /**
   * Load notifications from the server
   */
  loadNotifications(): void {
    this.http.get('/self/notifications').subscribe({
      next: (response: any) => {
        this.notifications = response.pageItems || [];
        this.notificationCount = this.notifications.filter(n => !n.read).length;
      },
      error: (error) => {
        console.error('Failed to load notifications:', error);
      }
    });
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: number): void {
    this.http.put(`/self/notifications/${notificationId}`, {}).subscribe({
      next: () => {
        // Update local notification state
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          this.notificationCount = this.notifications.filter(n => !n.read).length;
        }
      },
      error: (error) => {
        console.error('Failed to mark notification as read:', error);
      }
    });
  }

  /**
   * Toggle side navigation
   */
  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  /**
   * Toggle side navigation collapse
   */
  toggleSidenavCollapse(): void {
    this.sidenavCollapsed = !this.sidenavCollapsed;
    this.collapse.emit(this.sidenavCollapsed);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.http.post('/self/authentication/logout', {}).subscribe({
      next: () => {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still logout locally even if server call fails
        this.authenticationService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Get notification icon based on type
   */
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'INFO':
        return 'info-circle';
      case 'WARNING':
        return 'exclamation-triangle';
      case 'SUCCESS':
        return 'check-circle';
      case 'ERROR':
        return 'times-circle';
      default:
        return 'bell';
    }
  }
}
