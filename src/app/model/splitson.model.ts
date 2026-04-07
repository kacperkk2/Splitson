import { Currency } from '../app.component';

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

export interface CurrencyProfile {
  paidCurrency: Currency;
  exchangeRate: number;
  targetCurrency: Currency;
}

export class SplitsonData {
  constructor(
    public users: User[],
    public records: Record[],
    public name: string,
    public currencyProfile: CurrencyProfile,
    public date: string
  ) {}
}

export class SplitsonAppData {
  constructor(
    public active: SplitsonData,
    public archive: SplitsonData[]
  ) {}
}
