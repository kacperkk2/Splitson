import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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