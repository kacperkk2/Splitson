import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../dashboard/dashboard.component';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'edit-users-dialog',
  templateUrl: 'edit-users-dialog.html'
})
export class EditUsersDialog {
    newUserForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<EditUsersDialog>, 
        @Inject(MAT_DIALOG_DATA) public users: User[],
        public dialog: MatDialog
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

    deleteUser(userToDelete: User) {
        const index = this.users.map(user => user.name).indexOf(userToDelete.name, 0);
        if (index > -1) {
            this.users.splice(index, 1);
        }
    }

    onBackClick(): void {
        this.dialogRef.close();
    }

    clearAllData() {
        const message = "Czy na pewno chcesz usunąć wszystkie dane?"
        const dialogRef = this.dialog.open(ConfirmDialog, {data: message, width: '90%', maxWidth: '650px', autoFocus: false});
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.dialogRef.close(true);
          }
        });
      }
}