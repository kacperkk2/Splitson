import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  text: string;
  color?: string;
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html'
})
export class ConfirmDialog {
  title: string;
  text: string;
  color: string;

  constructor(
      public dialogRef: MatDialogRef<ConfirmDialog>,
      @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData | string
      ) {
    if (typeof data === 'string') {
      this.title = 'Potwierdź';
      this.text = data;
      this.color = 'warn';
    } else {
      this.title = data.title;
      this.text = data.text;
      this.color = data.color ?? 'warn';
    }
  }

  onBackClick(): void {
    this.dialogRef.close(false);
  }
}