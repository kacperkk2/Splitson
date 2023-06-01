import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignUsersDialog, AssignUsersDialogInput } from '../assign-users-dialog/assign-users-dialog';
import { Record, User } from '../dashboard/dashboard.component';
import { EditRecordDialog, EditRecordDialogResult } from '../edit-record-dialog/edit-record-dialog';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent {
  @Input() users: User[] = [];
  @Input() records: Record[] = [];
  @Input() recordsDeleteState: boolean = false;
  @Input() recordsEditState: boolean = false;

  constructor(public dialog: MatDialog) {}

  assignUsers(recordId: string) {
    let record = this.records.filter(record => record.id == recordId)[0];
    const data = new AssignUsersDialogInput(this.users, record.boughtBy)
    const dialogRef = this.dialog.open(AssignUsersDialog, {data: data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.returnOldAmout(record);
        record.boughtBy = result.selectedUsers;
        this.subtractNewAmout(record);
      }
    });
  }

  getAmountPerPerson(price: number, boughtBy: User[]) {
    if (boughtBy.length == 0) {
      return 0;
    }
    return Number((price / boughtBy.length).toFixed(2));
  }

  getUsersNames(users: User[]) {
    return users.map(user => user.name).join(", ")
  }

  deleteRecord(record: Record) {
    const index = this.records.map(record => record.id).indexOf(record.id, 0);
    if (index > -1) {
      this.returnOldAmout(record);
      this.records.splice(index, 1);
    }
  }

  editRecord(record: Record) {
    const dialogRef = this.dialog.open(EditRecordDialog, {data: record});
    dialogRef.afterClosed().subscribe((result: EditRecordDialogResult) => {
      if (result) {
        this.returnOldAmout(record);
        record.name = result.recordName;
        record.price = Number(result.recordPrice);
        this.subtractNewAmout(record);
      }
    });
  }

  returnOldAmout(record: Record) {
    let amount = this.getAmountPerPerson(record.price, record.boughtBy);
    record.boughtBy.forEach(user => user.balance = user.balance + amount);
  }

  subtractNewAmout(record: Record) {
    let amount = this.getAmountPerPerson(record.price, record.boughtBy);
    record.boughtBy.forEach(user => user.balance = user.balance - amount);
  }

  getPriceSum() {
    return this.records.map(record => record.price).reduce((sum, current) => sum + current, 0);
  }
}