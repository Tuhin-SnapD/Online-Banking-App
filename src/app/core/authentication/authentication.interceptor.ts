
/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Environment Configuration */
import { environment } from '../../../environments/environment';

/** Http request options headers. */
const httpOptions = {
  headers: {
    'Fineract-Platform-TenantId': environment.fineractPlatformTenantId
  }
};

/** Authorization header. */
const authorizationHeader = 'Authorization';

/**
 * Http Request interceptor to set the request headers.
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  private authorizationToken: string | null = null;

  constructor() {}

  /**
   * Intercepts a Http request and sets the request headers.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = { ...httpOptions.headers };
    
    // Add authorization header if available
    if (this.authorizationToken) {
      headers[authorizationHeader] = `Basic ${this.authorizationToken}`;
    }
    
    request = request.clone({ setHeaders: headers });
    return next.handle(request);
  }

  /**
   * Sets the basic/oauth authorization header depending on the configuration.
   * @param {string} authenticationKey Authentication key.
   */
  setAuthorizationToken(authenticationKey: string) {
    this.authorizationToken = authenticationKey;
  }
  
  /**
   * Removes the authorization header.
   */
  removeAuthorization() {
    this.authorizationToken = null;
  }
}
