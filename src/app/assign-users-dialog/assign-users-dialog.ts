import {Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { User, Record } from '../dashboard/dashboard.component';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { EditRecordDialog, EditRecordDialogResult } from '../edit-record-dialog/edit-record-dialog';
import { StorageService } from '../services/storage/storage.service';

@Component({
  selector: 'assign-users-dialog',
  templateUrl: 'assign-users-dialog.html'
})
export class AssignUsersDialog {
    @ViewChild('usersList') usersList: MatSelectionList;
    allSelected: boolean = false;
    
    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AssignUsersDialog>,
        @Inject(MAT_DIALOG_DATA) public data: AssignUsersDialogInput) {}

    ngOnInit(): void {
        if (this.data.allUsers.length == this.data.record.boughtBy.length) {
            this.allSelected = true;
        }
    }

    editRecord(record: Record) {
      const dialogRef = this.dialog.open(EditRecordDialog, {data: record, width: '90%', maxWidth: '650px', autoFocus: false});
      dialogRef.afterClosed().subscribe((result: EditRecordDialogResult) => {
        if (result) {
          if (result.deleteRecord) {
            this.dialogRef.close(new AssignUsersDialogResult([], true));
          }
          this.returnOldAmout(record);
          record.name = result.recordName;
          record.price = Number(result.recordPrice);
          this.subtractNewAmout(record);
        }
      });
    }

    returnOldAmout(record: Record) {
      let amount = this.getAmountPerPerson(record.price, record.boughtBy);
      record.boughtBy.forEach(user => {
        user.balance = user.balance + amount
      });
    }
  
    subtractNewAmout(record: Record) {
      let amount = this.getAmountPerPerson(record.price, record.boughtBy);
      record.boughtBy.forEach(user => user.balance = user.balance - amount);
    }

    getAmountPerPerson(price: number, boughtBy: User[]) {
      if (boughtBy.length == 0) {
        return 0;
      }
      return Number((price / boughtBy.length).toFixed(2));
    }

    onBackClick(): void {
        this.dialogRef.close();
    }

    onConfirmClick(data: MatListOption[]) {
        this.dialogRef.close(new AssignUsersDialogResult(data.map(element => element.value), false));
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
    constructor(public selectedUsers: User[], public deleteRecord: boolean) {}
}