import {Component, Input, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'online-banking-savings-overview-pie',
  templateUrl: './savings-overview-pie.component.html',
  styleUrls: ['./savings-overview-pie.component.css']
})
export class SavingsOverviewPieComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  chart: any;
  @Input() savingsAccounts: any[] = [];
  private viewInitialized = false;
  
  constructor() { }

  ngOnInit(): void {
    // Component initialized
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewInitialized && changes['savingsAccounts']) {
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    // Check if accounts data is available and valid
    if (!this.savingsAccounts || !Array.isArray(this.savingsAccounts) || this.savingsAccounts.length === 0) {
      return;
    }

    // Check if canvas element exists
    const canvas = document.getElementById('savings-pie') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Canvas element not found for savings pie chart');
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = [];
    const data = [];
    
    this.savingsAccounts.forEach((account) => {
      // Add null checks for account and status
      if (account && account.status && account.status.value) {
        const statusValue = account.status.value;
        const existingIndex = labels.indexOf(statusValue);
        
        if (existingIndex !== -1) {
          data[existingIndex] += 1;
        } else {
          data.push(1);
          labels.push(statusValue);
        }
      }
    });

    // Only create chart if we have data
    if (labels.length === 0 || data.length === 0) {
      return;
    }

    try {
      this.chart = new Chart(canvas, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'],
            data
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: '#667eea',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true
            }
          },
          layout: {
            padding: {
              top: 10,
              bottom: 15
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to create savings pie chart:', error);
    }
  }
}
