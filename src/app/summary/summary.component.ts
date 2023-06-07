import { Component, Input } from '@angular/core';
import { User, Record } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  currency: string = "zł";
  priceSum: number = 0;
  @Input() users: User[] = [];
  @Input() records: Record[] = [];

  ngOnInit(): void {
    this.priceSum = this.records.map(record => record.price).reduce((sum, current) => sum + current, 0);
  }

  getUserRatio(user: User) {
    if (user.balance == 0) {
      return 0;
    }
    return (-user.balance / this.priceSum) * 100;
  }
}
