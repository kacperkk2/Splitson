import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditUsersDialog } from '../edit-users-dialog/edit-users-dialog';
import { InsertReceiptDialog, InsertReceiptDialogResult } from '../insert-receipt-dialog/insert-receipt-dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  lastId: number = 1;

  constructor(public dialog: MatDialog) {}

  users: User[] = [
    {"name": "kacper", "balance": 0},
  ];

  records: Record[] = [
  ];

  editUsers() {
    const dialogRef = this.dialog.open(EditUsersDialog, {data: this.users});
  }

  addRecords() {
    const dialogRef = this.dialog.open(InsertReceiptDialog, {data: ""});
    dialogRef.afterClosed().subscribe((result: InsertReceiptDialogResult) => {
      if (result) {
        result.records.forEach(newRecord => {
          this.records.push({id: this.lastId, "name": newRecord.name, price: newRecord.price, "boughtBy": []})
          this.lastId += 1;
        });
      }
    });
  }
}

export interface User {
  name: string;
  balance: number;
}

export interface Record {
  id: number;
  name: string;
  price: number;
  boughtBy: User[];
}