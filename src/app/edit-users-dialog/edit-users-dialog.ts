import {Component, Inject, Output} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { CurrencyProfile, User } from '../dashboard/dashboard.component';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { EditNameDialog } from '../edit-name-dialog/edit-name-dialog';
import { Currency, CurrencySettings } from '../app.component';

@Component({
  selector: 'edit-users-dialog',
  templateUrl: 'edit-users-dialog.html',
  styleUrls: ['./edit-users-dialog.scss']
})
export class EditUsersDialog {
    currencies: Currency[];
    newUserForm: FormGroup;
    mainName: string = "";
    users: User[] = [];

    constructor(
        public dialogRef: MatDialogRef<EditUsersDialog>, 
        @Inject(MAT_DIALOG_DATA) public data: EditUsersDialogInput,
        public dialog: MatDialog
        ) {
          this.currencies = Array.from(CurrencySettings.all.values());
          this.mainName = data.mainName;
          this.users = data.users;
          this.newUserForm = new FormGroup({
              user: new FormControl("", [Validators.required])
          });
    }

    changeName() {
      const dialogRef = this.dialog.open(EditNameDialog, {data: this.mainName, width: '90%', maxWidth: '650px', autoFocus: false});
      dialogRef.afterClosed().subscribe((result: string) => {
        if (result) {
          this.mainName = result;
        }
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
      const result: EditUsersDialogResult = new EditUsersDialogResult(this.users, this.mainName, false, false);
      this.dialogRef.close(result);
    }

    clearAllData() {
      const message = "Czy na pewno chcesz usunąć wszystkie dane?"
      const dialogRef = this.dialog.open(ConfirmDialog, {data: message, width: '90%', maxWidth: '650px', autoFocus: false});
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(new EditUsersDialogResult([], "", true, false));
        }
      });
    }

    clearRecords() {
      const message = "Czy na pewno chcesz usunąć wszystkie rekordy?"
      const dialogRef = this.dialog.open(ConfirmDialog, {data: message, width: '90%', maxWidth: '650px', autoFocus: false});
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(new EditUsersDialogResult([], "", false, true));
        }
      });
    }

    compareObjects(o1: any, o2: any): boolean {
      return o1.name === o2.name;
    }
}

export class EditUsersDialogInput {
  constructor(public users: User[], public mainName: string, public currencyProfile: CurrencyProfile) {}
}

export class EditUsersDialogResult {
  constructor(public users: User[], public mainName: string, public clearAllData: boolean, public clearRecords: boolean, ) {}
}