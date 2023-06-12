import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { EditUsersDialog } from '../edit-users-dialog/edit-users-dialog';
import { StorageService, StorageServiceModel } from '../services/storage/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  recordsDeleteState: boolean = false;
  recordsEditState: boolean = false;
  users: User[] = [];
  records: Record[] = [];

  constructor(public dialog: MatDialog, private storageService: StorageService) {}

  ngOnInit(): void {
    let data: StorageServiceModel = this.storageService.load();
    this.users = data.users;
    this.records = data.records;
  }
  
  editUsers() {
    const previousUserNames = this.users.map(user => user.name);
    const dialogRef = this.dialog.open(EditUsersDialog, {data: this.users, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearAllData();
      }
      const currentUserNames = this.users.map(user => user.name);
      let deletedUsers = previousUserNames.filter(item => currentUserNames.indexOf(item) < 0);
      if (deletedUsers.length > 0) {
        this.removeDeletedUsersFromRecords(deletedUsers);
      }
      this.storageService.storeAll(this.users, this.records);
    });
  }

  removeDeletedUsersFromRecords(deletedUsers: string[]) {
    this.records
      .forEach(record => {
        const filteredOut = record.boughtBy.filter(user => !deletedUsers.includes(user.name));
        record.boughtBy = filteredOut;
    })
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