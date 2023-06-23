import { Injectable } from '@angular/core';
import { User, Record } from 'src/app/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  usersKey: string = "splitsonUsersKey";
  recordsKey: string = "splitsonRecordsKey";
  nameKey: string = "splitsonNameKey";

  constructor() { }

  public storeData(users: User[], records: Record[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    localStorage.setItem(this.recordsKey, JSON.stringify(records));
  }

  public storeAll(users: User[], records: Record[], name: string) {
    this.storeData(users, records);
    localStorage.setItem(this.nameKey, name);
  }

  public storeName(name: string) {
    localStorage.setItem(this.nameKey, name);
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
    const name = localStorage.getItem(this.nameKey) || "";
    return new StorageServiceModel(users, records, name);
  }
}

export class StorageServiceModel {
  constructor(public users: User[], public records: Record[], public name: string) {}
}