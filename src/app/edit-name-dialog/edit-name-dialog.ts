import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'edit-name-dialog',
  templateUrl: 'edit-name-dialog.html'
})
export class EditNameDialog {
    nameForm: FormGroup;
    maxLength: number = 40;

    constructor(
        public dialogRef: MatDialogRef<EditNameDialog>, 
        @Inject(MAT_DIALOG_DATA) public name: string
        ) {
        this.nameForm = new FormGroup({
            name: new FormControl(name, [Validators.required, Validators.maxLength(this.maxLength)]),
        });
    }

    save() {
        this.dialogRef.close(this.nameForm.get('name')!.value);
    }

    onBackClick(): void {
        this.dialogRef.close();
    }
}