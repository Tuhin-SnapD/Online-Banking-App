/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Environment Configuration */
import {environment} from '../../../environments/environment';
/**
 * Http request interceptor to prefix a request with `environment.serverUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  /**
   * Intercepts a Http request and prefixes it with `environment.serverUrl`.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const originalUrl = request.url;
    
    // Check if the URL is already absolute (starts with http:// or https://)
    if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://')) {
      console.log('API Prefix Interceptor: URL is already absolute, skipping prefix:', originalUrl);
      return next.handle(request);
    }
    
    // Build the complete URL
    let newUrl: string;
    
    try {
      // Ensure we have a clean base URL without trailing slash
      const baseUrl = environment.serverUrl.endsWith('/') 
        ? environment.serverUrl.slice(0, -1) 
        : environment.serverUrl;
      
      // Ensure we have clean API path without double slashes
      const apiPath = (environment.apiProvider + environment.apiVersion).replace(/\/+/g, '/');
      
      // Ensure request path starts with slash
      const requestPath = originalUrl.startsWith('/') ? originalUrl : '/' + originalUrl;
      
      newUrl = `${baseUrl}${apiPath}${requestPath}`;
      
      console.log('API Prefix Interceptor:', { 
        originalUrl, 
        newUrl, 
        baseUrl,
        apiPath,
        requestPath
      });
      
    } catch (error) {
      console.error('Error in API Prefix Interceptor:', error);
      return next.handle(request);
    }
    
    request = request.clone({ url: newUrl });
    return next.handle(request);
  }

}
