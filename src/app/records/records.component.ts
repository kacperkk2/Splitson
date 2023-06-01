import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignUsersDialog, AssignUsersDialogInput } from '../assign-users-dialog/assign-users-dialog';
import { Record, User } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent {
  @Input() users: User[] = [];
  @Input() records: Record[] = [];

  constructor(public dialog: MatDialog) {}

  assignUsers(recordId: number) {
    let record = this.records.filter(record => record.id == recordId)[0];
    const data = new AssignUsersDialogInput(this.users, record.boughtBy)
    const dialogRef = this.dialog.open(AssignUsersDialog, {data: data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let amount = this.getAmountPerPerson(record.price, record.boughtBy);
        record.boughtBy.forEach(user => user.balance = user.balance + amount);
        record.boughtBy = result.selectedUsers;
        amount = this.getAmountPerPerson(record.price, record.boughtBy);
        record.boughtBy.forEach(user => user.balance = user.balance - amount);
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
}