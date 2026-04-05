import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { CurrencyProfile, Record, User } from '../model/splitson.model';

@Component({
  selector: 'app-balance-tile',
  templateUrl: './balance-tile.component.html',
  styleUrls: ['./balance-tile.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
      state('expanded', style({ height: '*', overflow: 'hidden', opacity: 1 })),
      transition('collapsed <=> expanded', animate('250ms ease-in-out'))
    ]),
    trigger('rotateChevron', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('collapsed <=> expanded', animate('250ms ease-in-out'))
    ])
  ]
})
export class BalanceTileComponent {
  @Input() user: User;
  @Input() records: Record[];
  @Input() currencyProfile: CurrencyProfile;

  isExpanded = false;

  getBoughtRecords(): Record[] {
    return this.records.filter(record =>
      record.boughtBy.some(u => u.name === this.user.name)
    );
  }

  getPriceForUser(record: Record): number {
    return record.price / record.boughtBy.length;
  }

  toggle() {
    if (this.getBoughtRecords().length > 0) {
      this.isExpanded = !this.isExpanded;
    }
  }
}
