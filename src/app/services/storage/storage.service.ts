import { Injectable } from '@angular/core';
import { CurrencySettings, DEFAULT_NAME } from 'src/app/app.component';
import { CurrencyProfile, Record, SplitsonData, User } from 'src/app/model/splitson.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  key: string = "kacperkk2.Splitson";

  constructor() { }

  public save(data: SplitsonData) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  public load(): SplitsonData {
    const stored = localStorage.getItem(this.key);
    if (!stored) {
      return new SplitsonData([], [], DEFAULT_NAME, this.getDefaultCurrencyProfile());
    }
    const parsed = JSON.parse(stored) as SplitsonData;
    this.connectRecordsWithUsers(parsed.records, parsed.users);
    return parsed;
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
