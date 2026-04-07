import { Injectable } from '@angular/core';
import { CurrencySettings, DEFAULT_NAME } from 'src/app/app.component';
import { CurrencyProfile, Record, SplitsonAppData, SplitsonData, User } from 'src/app/model/splitson.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  key: string = "kacperkk2.Splitson";
  maxArchiveSize: number = 20;

  constructor() { }

  public save(data: SplitsonData) {
    const appData = this.loadAppData();
    appData.active = data;
    localStorage.setItem(this.key, JSON.stringify(appData));
  }

  public load(): SplitsonData {
    const appData = this.loadAppData();
    return appData.active;
  }

  public loadArchive(): SplitsonData[] {
    return this.loadAppData().archive;
  }

  public saveArchive(archive: SplitsonData[]) {
    const appData = this.loadAppData();
    appData.archive = archive;
    localStorage.setItem(this.key, JSON.stringify(appData));
  }

  public archiveCurrent() {
    const appData = this.loadAppData();
    const current = appData.active;
    if (current.users.length === 0 && current.records.length === 0) {
      return;
    }
    appData.archive.unshift(current);
    if (appData.archive.length > this.maxArchiveSize) {
      appData.archive = appData.archive.slice(0, this.maxArchiveSize);
    }
    localStorage.setItem(this.key, JSON.stringify(appData));
  }

  private loadAppData(): SplitsonAppData {
    const stored = localStorage.getItem(this.key);
    if (!stored) {
      return new SplitsonAppData(
        new SplitsonData([], [], DEFAULT_NAME, this.getDefaultCurrencyProfile(), new Date().toISOString().slice(0, 10)),
        []
      );
    }
    const parsed = JSON.parse(stored);
    // Migration: old format had users/records directly on the object
    if (parsed.users !== undefined || parsed.records !== undefined) {
      const migrated = parsed as SplitsonData;
      if (!migrated.date) migrated.date = new Date().toISOString().slice(0, 10);
      this.connectRecordsWithUsers(migrated.records, migrated.users);
      return new SplitsonAppData(migrated, []);
    }
    const appData = parsed as SplitsonAppData;
    if (!appData.active.date) appData.active.date = new Date().toISOString().slice(0, 10);
    this.connectRecordsWithUsers(appData.active.records, appData.active.users);
    return appData;
  }

  private connectRecordsWithUsers(records: Record[], users: User[]) {
    records.forEach(record => {
      record.boughtBy = record.boughtBy.map(boughtBy =>
        users.find(user => user.name === boughtBy.name)!
      );
    });
  }

  private getDefaultCurrencyProfile(): CurrencyProfile {
    return {
      paidCurrency: CurrencySettings.all.get(CurrencySettings.default)!,
      exchangeRate: 1,
      targetCurrency: CurrencySettings.all.get(CurrencySettings.default)!,
    };
  }
}
