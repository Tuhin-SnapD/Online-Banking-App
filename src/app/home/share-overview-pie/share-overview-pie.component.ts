import {Component, Input, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'online-banking-share-overview-pie',
  templateUrl: './share-overview-pie.component.html',
  styleUrls: ['./share-overview-pie.component.css']
})
export class ShareOverviewPieComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  /** The chart to render */
  chart: any;
  /** List of accounts as input */
  @Input() shareAccounts: any[] = [];
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
    if (this.viewInitialized && changes['shareAccounts']) {
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
    if (!this.shareAccounts || !Array.isArray(this.shareAccounts) || this.shareAccounts.length === 0) {
      return;
    }

    // Check if canvas element exists
    const canvas = document.getElementById('share-pie') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Canvas element not found for share pie chart');
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = [];
    const data = [];
    
    this.shareAccounts.forEach((account) => {
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
            backgroundColor: ['#4BC0C0', '#FFCE56', '#36A2EB', '#FF6384'],
            data,
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
      console.error('Failed to create share pie chart:', error);
    }
  }
}
