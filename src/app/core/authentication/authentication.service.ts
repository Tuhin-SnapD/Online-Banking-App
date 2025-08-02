/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** rxjs Imports */
import { of, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/** Custom Services */
import { AlertService } from '../alert/alert.service';

/** Custom Interceptors */
import { AuthenticationInterceptor } from './authentication.interceptor';

/** Custom Models */
import { LoginContext } from './login-context';
import { Credentials } from './credentials';
import { environment } from '../../../environments/environment';

/**
 * Authentication Workflow
 */
@Injectable()
export class AuthenticationService {

  /**
   * Currently storing User credentials in Session Storage for security
   * Note: Option to persist or un-persist credentials can be added here
   */
  private readonly storage: Storage = sessionStorage;

  /** User Credentials */
  private credentials: Credentials | null = null;
  
  /** Key to store credentials in the storage */
  private readonly credentialsStorageKey = 'selfServiceUserCredentials';
  
  /** Authentication state observable */
  private readonly authenticationStateSubject = new BehaviorSubject<boolean>(false);
  public readonly authenticationState$ = this.authenticationStateSubject.asObservable();

  /**
   * @param {HttpClient} http Http Client for network calls
   * @param {AlertService} alertService Alert Service
   * @param {AuthenticationInterceptor} authenticationInterceptor Interceptor for authentication requests
   */
  constructor(
    private readonly http: HttpClient,
    private readonly alertService: AlertService,
    private readonly authenticationInterceptor: AuthenticationInterceptor
  ) {
    this.initializeAuthenticationState();
  }

  /**
   * Initialize authentication state from storage
   */
  private initializeAuthenticationState(): void {
    try {
      const savedCredentials = this.getStoredCredentials();
      if (savedCredentials && this.isValidCredentials(savedCredentials)) {
        this.authenticationInterceptor.setAuthorizationToken(savedCredentials.base64EncodedAuthenticationKey);
        this.authenticationStateSubject.next(true);
      }
    } catch (error) {
      console.error('Error initializing authentication state:', error);
      this.clearStoredCredentials();
    }
  }

  /**
   * Get stored credentials safely
   */
  private getStoredCredentials(): Credentials | null {
    try {
      const stored = this.storage.getItem(this.credentialsStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing stored credentials:', error);
      return null;
    }
  }

  /**
   * Validate credentials structure
   */
  private isValidCredentials(credentials: any): credentials is Credentials {
    return credentials && 
           typeof credentials.base64EncodedAuthenticationKey === 'string' &&
           typeof credentials.username === 'string' &&
           Array.isArray(credentials.roles);
  }

  /**
   * Handles User Authentication
   * @param {LoginContext} loginContext Login Parameters
   * @returns {Observable<boolean>} True if User is authenticated
   */
  login(loginContext: LoginContext): Observable<boolean> {
    console.log('Login attempt with:', loginContext);
    this.alertService.alert({type: 'Authentication Start', message: 'Trying to login'});
    
    const requestUrl = '/self/authentication';
    const requestBody = {
      username: loginContext.username, 
      password: loginContext.password
    };
    
    console.log('Making request to:', requestUrl, 'with body:', requestBody);
    
    return this.http.post<Credentials>(requestUrl, requestBody).pipe(
      map((credentials: Credentials) => {
        console.log('Login successful, received credentials:', credentials);
        this.onLoginSuccess(credentials);
        return true;
      }),
      catchError((error) => {
        console.error('Authentication failed:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.alertService.alert({ 
          type: 'Authentication Error', 
          message: 'Login failed. Please check your credentials.' 
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Sets the Authorization Token.
   * @param {Credentials} credentials Authenticated user's credentials
   */
  private onLoginSuccess(credentials: Credentials): void {
    this.authenticationInterceptor.setAuthorizationToken(credentials.base64EncodedAuthenticationKey);
    this.setCredentials(credentials);
    this.authenticationStateSubject.next(true);
    this.alertService.alert({ 
      type: 'Authentication Success', 
      message: `${credentials.username} successfully logged in!` 
    });
  }

  /**
   * Logs out the user and clear the credentials from storage,
   * @returns {Observable<boolean>} True if user was logged out
   */
  logout(): Observable<boolean> {
    this.authenticationInterceptor.removeAuthorization();
    this.clearStoredCredentials();
    this.authenticationStateSubject.next(false);
    return of(true);
  }

  /**
   * @returns {boolean} True if the user has self service role
   */
  isSelfServiceUser(): boolean {
    const userCredentials = this.getStoredCredentials();
    if (!userCredentials) {
      return false;
    }
    return userCredentials.roles.some(role => role.id === environment.selfServiceRoleId);
  }

  /**
   * Checks if user is authenticated
   * @returns {boolean} True if the user is authenticated
   */
  isAuthenticated(): boolean {
    const credentials = this.getStoredCredentials();
    return !!(credentials && this.isSelfServiceUser());
  }

  /**
   * Returns the user's credentials
   * @returns {Credentials | null} the credentials in case of authenticated user else null
   */
  getCredentials(): Credentials | null {
    return this.getStoredCredentials();
  }

  /**
   * Sends a password reset mail
   * @param {string} email Email id of user
   * @returns {boolean} True if reset email was sent
   */
  resetPassword(email: string): boolean {
    // Implementation pending - should make HTTP call to reset password endpoint
    console.warn('Password reset functionality not implemented');
    return false;
  }

  /**
   * Sets the user credentials
   * @param {Credentials} credentials Authenticated user's credentials
   */
  private setCredentials(credentials: Credentials): void {
    try {
      this.storage.setItem(this.credentialsStorageKey, JSON.stringify(credentials));
    } catch (error) {
      console.error('Error storing credentials:', error);
    }
  }

  /**
   * Clear stored credentials
   */
  private clearStoredCredentials(): void {
    try {
      this.storage.removeItem(this.credentialsStorageKey);
    } catch (error) {
      console.error('Error clearing stored credentials:', error);
    }
  }
}
