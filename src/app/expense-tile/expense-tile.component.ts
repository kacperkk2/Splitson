import { Component, Input } from '@angular/core';
import { CurrencyProfile, Record } from '../model/splitson.model';

@Component({
  selector: 'app-expense-tile',
  templateUrl: './expense-tile.component.html',
  styleUrls: ['./expense-tile.component.scss']
})
export class ExpenseTileComponent {
  @Input() record: Record;
  @Input() currencyProfile: CurrencyProfile;

  get subLabel(): string | null {
    if (this.record.boughtBy.length === 0) return null;
    const perPerson = (this.record.price / this.record.boughtBy.length).toFixed(2);
    return `${this.record.boughtBy.length} * ${perPerson} ${this.currencyProfile.paidCurrency.short}`;
  }

  get subValue(): string | null {
    if (this.currencyProfile.paidCurrency.name === this.currencyProfile.targetCurrency.name) return null;
    return `${(this.record.price * this.currencyProfile.exchangeRate).toFixed(2)} ${this.currencyProfile.targetCurrency.short}`;
  }
}
