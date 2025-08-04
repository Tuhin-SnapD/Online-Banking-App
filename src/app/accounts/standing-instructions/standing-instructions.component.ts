import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'online-banking-standing-instructions',
  templateUrl: './standing-instructions.component.html',
  styleUrls: ['./standing-instructions.component.css']
})
export class StandingInstructionsComponent implements OnInit {
  standingInstructions: any[] = [];
  loading = false;
  error: string | null = null;
  displayedColumns: string[] = ['name', 'instructionType', 'status', 'amount', 'validFrom', 'validTill', 'recurrence', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService
  ) { }

  ngOnInit(): void {
    this.loadStandingInstructions();
  }

  loadStandingInstructions(): void {
    this.loading = true;
    this.error = null;

    // Get account type and ID from route params
    const accountType = this.route.snapshot.paramMap.get('accountType');
    const accountId = this.route.snapshot.paramMap.get('accountId');

    if (accountType && accountId) {
      this.accountsService.getAccountStandingInstructions(accountType, accountId).subscribe({
        next: (response) => {
          this.standingInstructions = response.pageItems || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load standing instructions';
          this.loading = false;
          console.error('Error loading standing instructions:', error);
        }
      });
    } else {
      // Load standing instructions for all accounts
      this.accountsService.getAllStandingInstructions().subscribe({
        next: (response) => {
          this.standingInstructions = response.pageItems || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load standing instructions';
          this.loading = false;
          console.error('Error loading standing instructions:', error);
        }
      });
    }
  }

  createStandingInstruction(): void {
    // TODO: Implement create standing instruction dialog
    console.log('Create standing instruction');
  }

  editStandingInstruction(instruction: any): void {
    // TODO: Implement edit standing instruction dialog
    console.log('Edit standing instruction:', instruction);
  }

  deleteStandingInstruction(instructionId: string): void {
    if (confirm('Are you sure you want to delete this standing instruction?')) {
      this.accountsService.deleteStandingInstruction(instructionId).subscribe({
        next: () => {
          this.loadStandingInstructions();
        },
        error: (error) => {
          console.error('Error deleting standing instruction:', error);
          this.error = 'Failed to delete standing instruction';
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'gray';
    }
  }
} 