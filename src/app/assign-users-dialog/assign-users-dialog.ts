import {Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { User, Record } from '../dashboard/dashboard.component';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'assign-users-dialog',
  templateUrl: 'assign-users-dialog.html'
})
export class AssignUsersDialog {
    @ViewChild('usersList') usersList: MatSelectionList;
    allSelected: boolean = false;
    
    constructor(
        public dialogRef: MatDialogRef<AssignUsersDialog>,
        @Inject(MAT_DIALOG_DATA) public data: AssignUsersDialogInput) {}

    ngOnInit(): void {
        if (this.data.allUsers.length == this.data.record.boughtBy.length) {
            this.allSelected = true;
        }
    }

    onBackClick(): void {
        this.dialogRef.close();
    }

    onConfirmClick(data: MatListOption[]) {
        this.dialogRef.close(new AssignUsersDialogResult(data.map(element => element.value)));
    }

    isUserSelected(user: User) {
        return this.data.record.boughtBy.filter(selectedUser => selectedUser.name == user.name).length > 0;
    }

    toggleAllSelection() {
        this.allSelected = !this.allSelected;
        if (this.allSelected) {
            this.usersList.options.forEach((item: MatListOption) => item.selected = true)
        } else {
            this.usersList.options.forEach((item: MatListOption) => item.selected = false)
        }
    }

    optionClick() {
        let newStatus = true;
        this.usersList.options.forEach((item: MatListOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelected = newStatus;
    }
}

export class AssignUsersDialogInput {
    constructor(public allUsers: User[], public record: Record, public currencyShort: string) {}
}

export class AssignUsersDialogResult {
    constructor(public selectedUsers: User[]) {}
}