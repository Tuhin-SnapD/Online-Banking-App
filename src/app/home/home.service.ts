import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../core/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  /**
   * @param {HttpClient} http Client for sending requests
   */
  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) { }

  getAccounts(): Observable<any> {
    const credentials = this.authenticationService.getCredentials();
    if (!credentials || !credentials.userId) {
      throw new Error('User credentials not found or invalid');
    }
    // Getting accounts for user
    return this.http.get(`/self/clients/${credentials.userId}/accounts`);
  }

}
