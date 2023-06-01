import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Record, User } from '../dashboard/dashboard.component';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'edit-record-dialog',
  templateUrl: 'edit-record-dialog.html'
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
        this.dialogRef.close(new EditRecordDialogResult(
            this.recordForm.get('name')!.value,
            this.recordForm.get('price')!.value
        ));
    }

    onBackClick(): void {
        this.dialogRef.close();
    }
}

export class EditRecordDialogResult {
    constructor(public recordName: string, public recordPrice: number) {}
}