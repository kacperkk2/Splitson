import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { User, Record } from '../dashboard/dashboard.component';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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