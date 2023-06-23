import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { EditUsersDialog, EditUsersDialogInput, EditUsersDialogResult } from '../edit-users-dialog/edit-users-dialog';
import { StorageService, StorageServiceModel } from '../services/storage/storage.service';
import { Buffer } from "buffer";
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { IdManagerService } from '../services/id-manager/id-manager.service';
import { CodecService } from '../services/codec/codec.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadedSplitsonDialog, LoadedSplitsonDialogInput } from '../loaded-splitson-dialog/loaded-splitson-dialog';
import { ShareLinkDialog } from '../share-link-dialog/share-link-dialog';

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
  defaultName: string = "Splitson";
  mainName: string = this.defaultName;

  constructor(public dialog: MatDialog, 
    private storageService: StorageService, 
    private idManager: IdManagerService,
    private codec: CodecService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=> {
      if (params['users'] && params['records'] && params['name']) {
        this.loadFromUrlAfterDialog(params['users'], params['records'], params['name']);
      }
      else {
        this.loadFromStore();
      }
      this.idManager.init(this.records);
    });
  }

  loadFromStore() {
    let data: StorageServiceModel = this.storageService.load();
    this.users = data.users;
    this.records = data.records;
    this.mainName = data.name;
  }

  loadFromUrlAfterDialog(usersText: string, recordsText: string, nameText: string) {
    const data: LoadedSplitsonDialogInput = this.loadFromUrl(usersText, recordsText, nameText);
    const dialogRef = this.dialog.open(LoadedSplitsonDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.storageService.storeAll(data.users, data.records, data.name);
        }
        this.router.navigate([], { queryParams: {} });
    });
  }

  loadFromUrl(usersText: string, recordsText: string, nameText: string) {
    const decompressedUsers = decompressFromBase64(usersText);
    const decompressedRecords = decompressFromBase64(recordsText);
    const name = decompressFromBase64(nameText);
    const users = this.codec.decodeUsers(decompressedUsers);
    return new LoadedSplitsonDialogInput(
      users, 
      this.codec.decodeRecords(decompressedRecords, users),
      name)
  }

  share() {
    const recordsText = this.codec.encodeRecords(this.records, this.users);
    const usersText = this.codec.encodeUsers(this.users);
    const compressedUsers = compressToBase64(usersText);
    const compressedRecords = compressToBase64(recordsText);
    const compressedName = compressToBase64(this.mainName);
    const users = encodeURIComponent(compressedUsers);
    const records = encodeURIComponent(compressedRecords);
    const name = encodeURIComponent(compressedName);
    const baseUrl = location.origin + "/Splitson"; // need to add splitson because of github pages 
    const shareUrl = baseUrl + "?name=" + name + "&users=" + users + "&records=" + records;
    const dialogRef = this.dialog.open(ShareLinkDialog, {data: shareUrl, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe();
  }
  
  editUsers() {
    const previousUserNames = this.users.map(user => user.name);
    const data = new EditUsersDialogInput(this.users, this.mainName)
    const dialogRef = this.dialog.open(EditUsersDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe((result: EditUsersDialogResult) => {
      if (result.resetApp) {
        this.clearAllData();
      }
      else {
        this.users = result.users;
        this.mainName = result.mainName;
        const currentUserNames = this.users.map(user => user.name);
        let deletedUsers = previousUserNames.filter(item => currentUserNames.indexOf(item) < 0);
        if (deletedUsers.length > 0) {
          this.removeDeletedUsersFromRecords(deletedUsers);
        }
      }
      this.storageService.storeAll(this.users, this.records, this.mainName);
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
    this.mainName = this.defaultName;
    this.idManager.clear();
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