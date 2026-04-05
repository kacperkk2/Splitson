import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Record } from '../model/splitson.model';

@Component({
  selector: 'edit-record-dialog',
  templateUrl: 'edit-record-dialog.html',
  styleUrls: ['edit-record-dialog.scss']
})
export class EditRecordDialog {
    recordForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<EditRecordDialog>, 
        @Inject(MAT_DIALOG_DATA) public record: Record
        ) {
        this.recordForm = new FormGroup({
            name: new FormControl(record.name, [Validators.required]),
            price: new FormControl(record.price, [Validators.required]),
        });
    }

    save() {
        let price = this.recordForm.get('price')!.value;
        price = String(price).split(",").join(".");
        price = price.trim();
        let name = this.recordForm.get('name')!.value;
        name = name.trim();
        this.dialogRef.close(new EditRecordDialogResult(name, Number(price), false));
    }

    onBackClick(): void {
        this.dialogRef.close();
    }

    delete() {
        this.dialogRef.close(new EditRecordDialogResult("", 0, true));
    }
}

export class EditRecordDialogResult {
    constructor(public recordName: string, public recordPrice: number, public deleteRecord: boolean) {}
}