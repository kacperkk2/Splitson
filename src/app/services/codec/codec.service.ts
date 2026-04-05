import { Injectable } from '@angular/core';
import { CurrencySettings } from 'src/app/app.component';
import { CurrencyProfile, Record, User } from 'src/app/model/splitson.model';

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
    return records.map(record =>
      record.name + this.insideEntityDelimiter +
      record.price + this.insideEntityDelimiter +
      this.mapUsersToCode(record.boughtBy, users)
    ).join(this.entityDelimiter);
  }

  mapUsersToCode(boughtBy: User[], allUsers: User[]) {
    if (boughtBy.length == 0) {
      return "[]"
    }
    return boughtBy.map(bought => allUsers.findIndex(user => user.name === bought.name)).join(',');
  }

  mapCodeToUsers(code: string, allUsers: User[]) {
    if (code == "[]") {
      return [];
    }
    return code.split(',').map(i => allUsers[Number(i)]);
  }

  decodeRecords(records: string, allUsers: User[]) {
    if (records == "[]") {
      return [];
    }
    let id = 0;
    return records.split(this.entityDelimiter)
      .filter(record => record.split(this.insideEntityDelimiter).length == 3)
      .map(record => {
        const parts = record.split(this.insideEntityDelimiter);
        return {
          id: ++id,
          name: parts[0],
          price: Number(parts[1]),
          boughtBy: this.mapCodeToUsers(parts[2], allUsers)
        };
      });
  }

  decodeUsers(users: string) {
    if (users == "[]") {
      return [];
    }
    return users.split(this.entityDelimiter)
      .filter(name => name.length > 0)
      .map(name => ({ name, balance: 0 }));
  }

  decodeCurrencyProfile(currencyProfile: string) {
    let currencyProfileList: string[] = currencyProfile.split(this.entityDelimiter)
    return this.getCurrencyProfile(currencyProfileList[0], Number(currencyProfileList[1]), currencyProfileList[2])
  }

  encodeUsers(users: User[]) {
    if (users.length == 0) {
      return "[]";
    }
    return users.map(user => user.name).join(this.entityDelimiter);
  }

  encodeCurrencyProfile(currencyProfile: CurrencyProfile) {
    let curencyProfileList: string[] = [currencyProfile.paidCurrency.name, String(currencyProfile.exchangeRate), currencyProfile.targetCurrency.name]
    return curencyProfileList.join(this.entityDelimiter);
  }

  getCurrencyProfile(paidCurrencyName: string, exchangeRate: number, targetCurrencyName: string) {
    return {
      paidCurrency: CurrencySettings.all.get(paidCurrencyName)!,
      exchangeRate: exchangeRate,
      targetCurrency: CurrencySettings.all.get(targetCurrencyName)!,
    };
  }
}