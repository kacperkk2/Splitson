import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html'
})
export class ConfirmDialog {
  priceSum: number = 0;

  constructor(
      public dialogRef: MatDialogRef<ConfirmDialog>, 
      @Inject(MAT_DIALOG_DATA) public text: string
      ) {}
}