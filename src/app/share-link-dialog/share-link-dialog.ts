import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'share-link-dialog',
  templateUrl: 'share-link-dialog.html'
})
export class ShareLinkDialog {
  copied: boolean = false;

  constructor(
      public dialogRef: MatDialogRef<ShareLinkDialog>, 
      @Inject(MAT_DIALOG_DATA) public text: string
      ) {}
  
  copy() {
    this.copied = true;
  }
}