import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthenticationService} from '../core/authentication/authentication.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  /**
   * @param {HttpClient} http Client for sending requests
   */
  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  getAccounts(): Observable<any> {
    const credentials = this.authenticationService.getCredentials();
    
    if (!credentials) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return throwError(() => new Error('User credentials not found or invalid'));
    }
    
    if (!credentials.userId) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return throwError(() => new Error('User ID not found in credentials'));
    }
    
    const apiUrl = `/self/clients/${credentials.userId}/accounts`;
    
    // Getting accounts for user
    return this.http.get(apiUrl);
  }

}
