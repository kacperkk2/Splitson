import { Component, Input } from '@angular/core';
import { User, Record, CurrencyProfile } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() users: User[] = [];
  @Input() records: Record[] = [];
  @Input() currencyProfile: CurrencyProfile;

  getTotalPriceSum() {
    return this.records.map(record => record.price).reduce((sum, current) => sum + current, 0);
  }

  getPaidSum() {
    return this.users.map(user => user.balance).reduce((sum, current) => sum - current, 0);
  }
}
