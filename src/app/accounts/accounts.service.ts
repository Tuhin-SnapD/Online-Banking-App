import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../core/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  /**
   * @param {HttpClient} http Client for sending requests
   * @param {AuthenticationService} authenticationService Service for obtaining authentication details
   */
  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) { }

  getAccounts(): Observable<any> {
    const userId = this.authenticationService.getCredentials().userId;
    return this.http.get(`/self/clients/${userId}/accounts`);
  }

  getAccountStatements(accountType: string, accountId: string): Observable<any> {
    return this.http.get(`/self/accounts/${accountType}/${accountId}/statements`);
  }

  getAllAccountStatements(): Observable<any> {
    const userId = this.authenticationService.getCredentials().userId;
    return this.http.get(`/self/clients/${userId}/statements`);
  }

  downloadStatement(accountType: string, accountId: string, statementId: string): Observable<Blob> {
    return this.http.get(`/self/accounts/${accountType}/${accountId}/statements/${statementId}`, {
      responseType: 'blob'
    });
  }

  getAccountStandingInstructions(accountType: string, accountId: string): Observable<any> {
    return this.http.get(`/self/accounts/${accountType}/${accountId}/standinginstructions`);
  }

  getAllStandingInstructions(): Observable<any> {
    const userId = this.authenticationService.getCredentials().userId;
    return this.http.get(`/self/clients/${userId}/standinginstructions`);
  }

  createStandingInstruction(instruction: any): Observable<any> {
    return this.http.post('/self/standinginstructions', instruction);
  }

  updateStandingInstruction(instructionId: string, instruction: any): Observable<any> {
    return this.http.put(`/self/standinginstructions/${instructionId}`, instruction);
  }

  deleteStandingInstruction(instructionId: string): Observable<any> {
    return this.http.delete(`/self/standinginstructions/${instructionId}`);
  }
}
