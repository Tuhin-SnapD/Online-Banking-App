import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { startWith, delay, tap } from 'rxjs/operators';

@Component({
  selector: 'online-banking-savings-accounts-list',
  templateUrl: './savings-accounts-list.component.html',
  styleUrls: ['./savings-accounts-list.component.css']
})
export class SavingsAccountsListComponent implements OnInit, AfterViewInit {

  @Input() savingsAccounts: any;

  displayedColumns: string[] = ['accountNo', 'status', 'type' , 'accountBalance', 'submittedOn' ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    /* Refer: https://blog.angular-university.io/angular-debugging/  workaround with delayed data binding */
    this.paginator.page
          .pipe(
            startWith(null),
            delay(0),
            tap(() => this.setAccountsTable()
            )
          ).subscribe();
  }

  /**
   * Initializes the data source, paginator and sorter for Permissions table
   */
  setAccountsTable() {
    // Ensure savingsAccounts is an array before creating the data source
    const savingsAccountsArray = Array.isArray(this.savingsAccounts) ? this.savingsAccounts : [];
    this.dataSource = new MatTableDataSource(savingsAccountsArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /**
   * Filters data in Permissions table based on passed value.
   * @param {string} filterValue Value to filter data
   */
  applyFilter(filterValue: string) {
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

}
