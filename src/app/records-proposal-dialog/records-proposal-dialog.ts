import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../dashboard/dashboard.component';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'records-proposal-dialog',
  templateUrl: 'records-proposal-dialog.html'
})
export class RecordsProposalDialog {
  priceSum: number = 0;

  constructor(
      public dialogRef: MatDialogRef<RecordsProposalDialog>, 
      @Inject(MAT_DIALOG_DATA) public data: RecordsProposalDialogInput
      ) {
        data.records.forEach(record => this.priceSum += record.price);
  }
}

export class RecordsProposalDialogInput {
  constructor(public records: RecordProposal[], public currencyShort: string) {}
}

export interface RecordProposal {
  name: string;
  price: number;
}