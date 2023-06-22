import { Injectable } from '@angular/core';
import { Record, User } from 'src/app/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class CodecService {
  entityDelimiter: string = "||";
  insideEntityDelimiter: string = "|@";
  
  constructor() { }

  encodeRecords(records: Record[], users: User[]) {
    if (records.length == 0) {
      return "[]";
    }
    let recordsList: string[] = [];
    records.forEach(record => {
      recordsList.push(
        record.id + this.insideEntityDelimiter + 
        record.name + this.insideEntityDelimiter + 
        record.price + this.insideEntityDelimiter + 
        this.mapUsersToCode(record.boughtBy, users))
    });
    return recordsList.join(this.entityDelimiter);
  }

  mapUsersToCode(boughtBy: User[], allUsers: User[]) {
    if (boughtBy.length == 0) {
      return "[]"
    }
    let code: string = "";
    boughtBy.forEach(bought => code += allUsers.findIndex(user => user.name === bought.name))
    return code;
  }

  mapCodeToUsers(code: string, allUsers: User[]) {
    if (code == "[]") {
      return [];
    }
    let boughtBy: User[] = [];
    [...code].forEach(position => boughtBy.push(allUsers[Number(position)]))
    return boughtBy;
  }

  decodeRecords(records: string, allUsers: User[]) {
    if (records == "[]") {
      return [];
    }
    let recordsList: Record[] = [];
    records.split(this.entityDelimiter).forEach(record => {
      const recordData = record.split(this.insideEntityDelimiter);
      if (recordData.length != 4) {
        return;
      }
      recordsList.push({
        "id": Number(recordData[0]), 
        "name": recordData[1], 
        "price": Number(recordData[2]), 
        "boughtBy": this.mapCodeToUsers(recordData[3], allUsers)
      });
    });
    return recordsList;
  }

  decodeUsers(users: string) {
    if (users == "[]") {
      return [];
    }
    let usersList: User[] = [];
    users.split(this.entityDelimiter).forEach(user => {
      const userData = user.split(this.insideEntityDelimiter);
      if (userData.length != 2) {
        return;
      }
      usersList.push({
        "name": userData[0], 
        "balance": Number(userData[1])
      });
    });
    return usersList;
  }

  encodeUsers(users: User[]) {
    if (users.length == 0) {
      return "[]";
    }
    let usersList: string[] = [];
    users.forEach(user => usersList.push(
        user.name + this.insideEntityDelimiter + 
        user.balance
      ));
    return usersList.join(this.entityDelimiter);
  }
}