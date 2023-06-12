import { Injectable } from '@angular/core';
import { User, Record } from 'src/app/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  usersKey: string = "splitsonUsersKey";
  recordsKey: string = "splitsonRecordsKey";

  constructor() { }

  public storeAll(users: User[], records: Record[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    localStorage.setItem(this.recordsKey, JSON.stringify(records));
  }

  public storeUsers(users: User[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  public storeRecords(records: Record[]) {
    localStorage.setItem(this.recordsKey, JSON.stringify(records));
  }

  public load(): StorageServiceModel {
    const records = JSON.parse(localStorage.getItem(this.recordsKey) || '[]');
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    return new StorageServiceModel(users, records);
  }
}

export class StorageServiceModel {
  constructor(public users: User[], public records: Record[]) {}
}