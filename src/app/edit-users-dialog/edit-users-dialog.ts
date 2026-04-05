import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Currency, CurrencySettings } from '../app.component';
import { CurrencyProfile, User } from '../model/splitson.model';

@Component({
  selector: 'edit-users-dialog',
  templateUrl: 'edit-users-dialog.html',
  styleUrls: ['./edit-users-dialog.scss']
})
export class EditUsersDialog {
    currencies: Currency[];
    newUserForm: FormGroup;
    mainName: string = "";
    mainDate: string = "";
    users: User[] = [];

    constructor(
        public dialogRef: MatDialogRef<EditUsersDialog>,
        @Inject(MAT_DIALOG_DATA) public data: EditUsersDialogInput,
        public dialog: MatDialog
        ) {
          this.currencies = Array.from(CurrencySettings.all.values());
          this.mainName = data.mainName;
          this.mainDate = data.date;
          this.users = data.users;
          this.newUserForm = new FormGroup({
              user: new FormControl("", [Validators.required])
          });
    }

    onNameInput(event: Event) {
        const name = (event.target as HTMLInputElement).value;
        this.mainName = name;
        this.data.onNameChange?.(name);
    }

    onDateInput(event: Event) {
        this.mainDate = (event.target as HTMLInputElement).value;
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
      const result: EditUsersDialogResult = new EditUsersDialogResult(this.users, this.mainName, this.mainDate);
      this.dialogRef.close(result);
    }

    compareObjects(o1: any, o2: any): boolean {
      return o1.name === o2.name;
    }
}

export class EditUsersDialogInput {
  constructor(public users: User[], public mainName: string, public currencyProfile: CurrencyProfile, public date: string, public onNameChange?: (name: string) => void) {}
}

export class EditUsersDialogResult {
  constructor(public users: User[], public mainName: string, public date: string) {}
}