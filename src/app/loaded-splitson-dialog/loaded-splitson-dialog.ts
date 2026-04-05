import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SplitsonData, User } from '../model/splitson.model';

@Component({
  selector: 'loaded-splitson-dialog',
  templateUrl: 'loaded-splitson-dialog.html'
})
export class LoadedSplitsonDialog {
  priceSum: number = 0;

  constructor(
      public dialogRef: MatDialogRef<LoadedSplitsonDialog>,
      @Inject(MAT_DIALOG_DATA) public data: SplitsonData
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