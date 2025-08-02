import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from './accounts.model';
import { AuthenticationService } from '../core/authentication/authentication.service';

interface Account {
  id: number;
  accountNo: string;
  productName: string;
  status: { id: number; code: string; value: string };
  currency: { code: string; name: string };
  accountBalance?: number;
  loanBalance?: number;
}

@Component({
  selector: 'online-banking-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  totalAccounts = 0;
  loanAccounts: Account[] = [];
  savingsAccounts: Account[] = [];
  shareAccounts: Account[] = [];
  totalSavings = '0';
  totalLoan = '0';
  username = 'User';
  recentTransactionsCount = 0;
  // Loading indicator - to be implemented
  loading = true;

  constructor(
    private readonly homeService: HomeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) {
    this.route.data.subscribe((data: { accounts: Accounts }) => {
      const { loanAccounts, savingsAccounts, shareAccounts } = data.accounts;
      this.loanAccounts = loanAccounts || [];
      this.savingsAccounts = savingsAccounts || [];
      this.shareAccounts = shareAccounts || [];
    });
  }

  ngOnInit(): void {
    // Get username from authentication service
    const credentials = this.authenticationService.getCredentials();
    if (credentials) {
      this.username = credentials.username;
    }

    // Home component initialized with account data
    this.setAccounts();
  }

  setAccounts(): void {
    this.totalAccounts = this.loanAccounts.length + this.savingsAccounts.length + this.shareAccounts.length;
    
    // Calculate total savings balance
    let savingsBalance = 0;
    this.savingsAccounts.forEach((account) => {
      const { accountBalance } = account;
      if (accountBalance && typeof accountBalance === 'number') {
        savingsBalance += accountBalance;
      }
    });
    this.totalSavings = savingsBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Calculate total loan balance
    let loansBalance = 0;
    this.loanAccounts.forEach((account) => {
      const { loanBalance } = account;
      if (loanBalance && typeof loanBalance === 'number') {
        loansBalance += loanBalance;
      }
    });
    this.totalLoan = loansBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    this.loading = false;
  }
}
