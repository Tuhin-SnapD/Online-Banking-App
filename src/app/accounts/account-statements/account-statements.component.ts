import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'online-banking-account-statements',
  templateUrl: './account-statements.component.html',
  styleUrls: ['./account-statements.component.css']
})
export class AccountStatementsComponent implements OnInit {
  statements: any[] = [];
  loading = false;
  error: string | null = null;
  displayedColumns: string[] = ['statementId', 'statementDate', 'period', 'openingBalance', 'closingBalance', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService
  ) { }

  ngOnInit(): void {
    this.loadStatements();
  }

  loadStatements(): void {
    this.loading = true;
    this.error = null;

    // Get account type and ID from route params
    const accountType = this.route.snapshot.paramMap.get('accountType');
    const accountId = this.route.snapshot.paramMap.get('accountId');

    if (accountType && accountId) {
      this.accountsService.getAccountStatements(accountType, accountId).subscribe({
        next: (response) => {
          this.statements = response.pageItems || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load account statements';
          this.loading = false;
          console.error('Error loading statements:', error);
        }
      });
    } else {
      // Load statements for all accounts
      this.accountsService.getAllAccountStatements().subscribe({
        next: (response) => {
          this.statements = response.pageItems || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load account statements';
          this.loading = false;
          console.error('Error loading statements:', error);
        }
      });
    }
  }

  downloadStatement(accountType: string, accountId: string, statementId: string): void {
    this.accountsService.downloadStatement(accountType, accountId, statementId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `statement-${statementId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading statement:', error);
        this.error = 'Failed to download statement';
      }
    });
  }
} 