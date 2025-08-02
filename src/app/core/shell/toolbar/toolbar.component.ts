import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

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

  /** Instance of side navigation drawer */
  @Input() sidenav!: MatSidenav;
  
  /** Sidenav Collapse Event emitter */
  @Output() collapse = new EventEmitter<boolean>();

  private handsetSubscription: Subscription | null = null;

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint Observer to detect screen size.
   * @param {Router} router Router
   * @param {AuthenticationService} authenticationService Authentication Service
   */
  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    // Get user information
    const credentials = this.authenticationService.getCredentials();
    if (credentials) {
      this.username = credentials.username;
      this.userEmail = `${credentials.username}@banking.com`;
    }
    
    this.handsetSubscription = this.isHandset$.subscribe(isHandset => {
      if (isHandset && this.sidenavCollapsed) {
        this.toggleSidenavCollapse(false);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.handsetSubscription) {
      this.handsetSubscription.unsubscribe();
      this.handsetSubscription = null;
    }
  }

  /**
   * Reverse the current state of side navigation
   */
  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  /**
   * Toggles the current collapsed state of sidenav.
   */
  toggleSidenavCollapse(sidenavCollapsed?: boolean): void {
    this.sidenavCollapsed = sidenavCollapsed ?? !this.sidenavCollapsed;
    this.collapse.emit(this.sidenavCollapsed);
  }

  /**
   * Logs out the user and redirects to login page
   */
  logout(): void {
    this.authenticationService.logout()
      .subscribe({
        next: () => this.router.navigate(['/login'], { replaceUrl: true }),
        error: (error) => console.error('Logout error:', error)
      });
  }
}
