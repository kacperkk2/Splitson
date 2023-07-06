import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'splitson';
}

export class Currency {
  constructor(public name: string, public short: string) {}
}

export class CurrencySettings {
  static default: string = "PLN";
  static all: Map<string, Currency> = new Map([
    ["EUR", new Currency("EUR", "€")],
    ["PLN", new Currency("PLN", "zł")],
    ["USD", new Currency("USD", "$")],
  ]);
}

export const DEFAULT_NAME: string = "Splitson";