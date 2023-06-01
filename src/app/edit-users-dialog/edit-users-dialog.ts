import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../dashboard/dashboard.component';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'edit-users-dialog',
  templateUrl: 'edit-users-dialog.html'
})
export class EditUsersDialog {
    newUserForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<EditUsersDialog>, 
        @Inject(MAT_DIALOG_DATA) public users: User[]
        ) {
        this.newUserForm = new FormGroup({
            user: new FormControl("", [Validators.required])
        });
    }

    addUser() {
        const user = this.newUserForm.controls['user'].value!.trim();
        this.users.push({"name": user, "balance": 0})
        this.newUserForm.reset();
    }

    onBackClick(): void {
        this.dialogRef.close();
    }
}