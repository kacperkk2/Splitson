import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { User, Record } from '../dashboard/dashboard.component';

@Component({
  selector: 'loaded-splitson-dialog',
  templateUrl: 'loaded-splitson-dialog.html'
})
export class LoadedSplitsonDialog {
  priceSum: number = 0;

  constructor(
      public dialogRef: MatDialogRef<LoadedSplitsonDialog>, 
      @Inject(MAT_DIALOG_DATA) public data: LoadedSplitsonDialogInput
      ) {
        data.records.forEach(record => this.priceSum += record.price);
  }

  getUsersSummary(users: User[]) {
    if (users.length == 0) {
      return "Brak"
    }
    return users.map(user => user.name + "(" + user.balance + ")").join(", ")
  }
}

export class LoadedSplitsonDialogInput {
  constructor(public users: User[], public records: Record[], public name: string) {}
}