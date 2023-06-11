import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { EditUsersDialog } from '../edit-users-dialog/edit-users-dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  recordsDeleteState: boolean = false;
  recordsEditState: boolean = false;
  users: User[] = [
    {"name": "Kacpix", "balance": 0},
    {"name": "Klaudix", "balance": 0},
  ];
  records: Record[] = [
    {"id": "a", "name": "costam", "price": 109, "boughtBy": []},
    {"id": "b", "name": "b", "price": 109, "boughtBy": []},
  ];

  constructor(public dialog: MatDialog) {}

  editUsers() {
    const dialogRef = this.dialog.open(EditUsersDialog, {data: this.users, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearAllData();
      }
    });
  }

  getUsersNamesLabel(users: User[]) {
    if (users.length == 0) {
      return "Kliknij żeby dodać użytkowników"
    }
    return users.map(user => user.name).join(", ")
  }

  toggleRecordsDeleteState() {
    this.recordsDeleteState = !this.recordsDeleteState;
  }

  toggleRecordsEditState() {
    this.recordsEditState = !this.recordsEditState;
  }

  clearAllData() {
    this.records = [];
    this.users = [];
  }
}

export interface User {
  name: string;
  balance: number;
}

export interface Record {
  id: string;
  name: string;
  price: number;
  boughtBy: User[];
}