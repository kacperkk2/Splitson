import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoughtRecordsSummaryDialog, BoughtRecordsSummaryDialogInput } from '../bought-records-summary-dialog/bought-records-summary-dialog';
import { User, Record, CurrencyProfile } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() users: User[] = [];
  @Input() records: Record[] = [];
  @Input() currencyProfile: CurrencyProfile;

  constructor(public dialog: MatDialog) {}

  getUserRatio(user: User) {
    const priceSum = this.records.map(record => record.price).reduce((sum, current) => sum + current, 0);
    if (user.balance == 0) {
      return 0;
    }
    return (-user.balance / priceSum) * 100;
  }

  getPriceSum() {
    return this.records.map(record => record.price).reduce((sum, current) => sum + current, 0);
  }

  getPaidSum() {
    return this.users.map(user => user.balance).reduce((sum, current) => sum - current, 0);
  } 
  
  showBoughtRecords(user: User) {
    let bought = this.records.filter(record => record.boughtBy.map(boughtBy => boughtBy.name).includes(user.name));
    const data: BoughtRecordsSummaryDialogInput = new BoughtRecordsSummaryDialogInput(bought, user, this.currencyProfile.paidCurrency.short);
    const dialogRef = this.dialog.open(BoughtRecordsSummaryDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe();
  }
}
