import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'share-link-dialog',
  templateUrl: 'share-link-dialog.html'
})
export class ShareLinkDialog {
  copied: boolean = false;
  shortUrlPicked: boolean = true;
  shortUrlNotAvailable: boolean = false;

  constructor(public dialogRef: MatDialogRef<ShareLinkDialog>, @Inject(MAT_DIALOG_DATA) public data: ShareLinkDialogInput) {
    if (data.shortUrl === '') {
      this.shortUrlPicked = false;
      this.shortUrlNotAvailable = true;
    }
  }
  
  copy() {
    this.copied = true;
  }

  toggleClick() {
    this.copied = false;
  }
}

export class ShareLinkDialogInput {
  constructor(public shortUrl: string, public longUrl: string) {}
}