import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Record, User } from '../model/splitson.model';

@Component({
  selector: 'bought-records-summary-dialog',
  templateUrl: 'bought-records-summary-dialog.html'
})
export class BoughtRecordsSummaryDialog {
  priceSum: number = 0;

  constructor(
      public dialogRef: MatDialogRef<BoughtRecordsSummaryDialog>, 
      @Inject(MAT_DIALOG_DATA) public data: BoughtRecordsSummaryDialogInput
      ) {
        data.records.forEach(record => this.priceSum += record.price / record.boughtBy.length);
  }
}

export class BoughtRecordsSummaryDialogInput {
  constructor(public records: Record[], public user: User, public currencyShort: string) {}
}