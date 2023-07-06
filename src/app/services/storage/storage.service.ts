import { Injectable } from '@angular/core';
import { CurrencySettings, DEFAULT_NAME } from 'src/app/app.component';
import { User, Record, CurrencyProfile } from 'src/app/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  usersKey: string = "splitsonUsersKey";
  recordsKey: string = "splitsonRecordsKey";
  nameKey: string = "splitsonNameKey";
  currencyProfileKey: string = "currencyProfileKey";

  constructor() { }

  public storeData(users: User[], records: Record[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    localStorage.setItem(this.recordsKey, JSON.stringify(records));
  }

  public storeAll(users: User[], records: Record[], name: string, currencyProfile: CurrencyProfile) {
    this.storeData(users, records);
    this.storeName(name);
    this.storeCurrencyProfile(currencyProfile);
  }

  public storeCurrencyProfile(currencyProfile: CurrencyProfile) {
    const currencyProfileStore: CurrencyProfileStore = {
      paidCurrencyName: currencyProfile.paidCurrency.name,
      targetCurrencyName: currencyProfile.targetCurrency.name,
      exchangeRate: currencyProfile.exchangeRate,
    }
    localStorage.setItem(this.currencyProfileKey, JSON.stringify(currencyProfileStore));
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
    const name = localStorage.getItem(this.nameKey) || DEFAULT_NAME;
    const currencyProfile = this.loadCurrencyProfile();
    return new StorageServiceModel(users, records, name, currencyProfile);
  }

  loadCurrencyProfile() {
    let currencyProfileStore: CurrencyProfileStore = JSON.parse(localStorage.getItem(this.currencyProfileKey) || "{}");
    return Object.keys(currencyProfileStore).length == 0 
              ? this.getCurrencyProfile(CurrencySettings.default, 1, CurrencySettings.default) 
              : this.getCurrencyProfile(currencyProfileStore.paidCurrencyName, currencyProfileStore.exchangeRate, currencyProfileStore.targetCurrencyName);
  }

  getCurrencyProfile(paidCurrencyName: string, exchangeRate: number, targetCurrencyName: string) {
    return {
      paidCurrency: CurrencySettings.all.get(paidCurrencyName)!,
      exchangeRate: exchangeRate,
      targetCurrency: CurrencySettings.all.get(targetCurrencyName)!,
    };
  }
}

export class StorageServiceModel {
  constructor(public users: User[], public records: Record[], public name: string, public currencyProfile: CurrencyProfile) {}
}

export interface CurrencyProfileStore {
  paidCurrencyName: string;
  targetCurrencyName: string;
  exchangeRate: number;
}