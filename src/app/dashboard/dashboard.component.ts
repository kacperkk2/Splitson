import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditUsersDialog } from '../edit-users-dialog/edit-users-dialog';
import { InsertReceiptDialog, InsertReceiptDialogResult } from '../insert-receipt-dialog/insert-receipt-dialog';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  recordsDeleteState: boolean = false;
  recordsEditState: boolean = false;
  users: User[] = [
    {"name": "kacper", "balance": 0},
  ];
  records: Record[] = [
    {"id": "a", "name": "costam", "price": 109, "boughtBy": []},
    {"id": "b", "name": "costam", "price": 109, "boughtBy": []},
  ];

  constructor(public dialog: MatDialog) {}

  editUsers() {
    const dialogRef = this.dialog.open(EditUsersDialog, {data: this.users});
  }

  addRecords() {
    const dialogRef = this.dialog.open(InsertReceiptDialog, {data: ""});
    dialogRef.afterClosed().subscribe((result: InsertReceiptDialogResult) => {
      if (result) {
        result.records.forEach(newRecord => {
          this.records.push({id: uuid(), "name": newRecord.name, price: newRecord.price, "boughtBy": []});
        });
      }
    });
  }

  toggleRecordsDeleteState() {
    this.recordsDeleteState = !this.recordsDeleteState;
  }

  toggleRecordsEditState() {
    this.recordsEditState = !this.recordsEditState;
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