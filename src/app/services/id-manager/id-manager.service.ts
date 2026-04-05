import { Injectable } from '@angular/core';
import { Record } from 'src/app/model/splitson.model';

@Injectable({
  providedIn: 'root'
})
export class IdManagerService {
  lastId: number = 0;

  constructor() { }

  init(records: Record[]) {
    if (records.length == 0) {
      return;
    }
    this.lastId = Math.max(...records.map(r => r.id));
  }

  incrementAndGet() {
    this.lastId += 1;
    return this.lastId;
  }

  clear() {
    this.lastId = 0;
  }
}