import {Component, Input, OnInit} from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'online-banking-loan-overview-pie',
  templateUrl: './loan-overview-pie.component.html',
  styleUrls: ['./loan-overview-pie.component.css']
})
export class LoanOverviewPieComponent implements OnInit {
  @Input() loanAccounts: any;
  chart: any;
  constructor() { }

  ngOnInit(): void {
    const labels = [];
    const data = [];
    // Loan accounts loaded for pie chart
    this.loanAccounts.forEach((account) => {
      if (labels.indexOf(account.status.value) !== -1){
        data[labels.indexOf(account.status.value)] += 1;
      }
      else {
        data.push(1);
        labels.push(account.status.value);
      }
    });

          // Chart data prepared
    this.chart = new Chart('loan-pie', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          backgroundColor: ['yellow', 'blue', 'green', 'pink', 'red', 'green', 'yellow', 'blue', 'pink'],
          data
        }]
      },
      options: {
        layout: {
          padding: {
            top: 10,
            bottom: 15
          }
        }
      }
    });
  }

}
