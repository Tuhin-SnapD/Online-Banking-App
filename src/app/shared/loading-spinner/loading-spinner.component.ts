import { Component, Input } from '@angular/core';

@Component({
  selector: 'online-banking-loading-spinner',
  template: `
    <div class="loading-container" [ngClass]="{ 'overlay': overlay }">
      <div class="spinner-wrapper">
        <mat-spinner [diameter]="getSpinnerSize()" class="spinner"></mat-spinner>
        <p class="loading-message" *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .loading-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      padding: 0;
    }
    
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .spinner {
      color: #667eea;
    }
    
    .loading-message {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      text-align: center;
    }
    
    .overlay .loading-message {
      color: white;
      font-size: 1rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message = 'Loading...';
  @Input() overlay = false;

  getSpinnerSize(): number {
    switch (this.size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 36;
    }
  }
} 