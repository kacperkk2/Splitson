import { Injectable } from '@angular/core';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { SplitsonData } from 'src/app/model/splitson.model';
import { CodecService } from '../codec/codec.service';

const SECTION_DELIMITER = '\x01';

@Injectable({
  providedIn: 'root'
})
export class CompressorService {
  constructor(private codec: CodecService) {}

  compress(data: SplitsonData): string {
    const usersEncoded = this.codec.encodeUsers(data.users);
    const recordsEncoded = this.codec.encodeRecords(data.records, data.users);
    const currencyEncoded = this.codec.encodeCurrencyProfile(data.currencyProfile);
    const combined = [usersEncoded, recordsEncoded, data.name, currencyEncoded, data.date].join(SECTION_DELIMITER);
    return compressToEncodedURIComponent(combined);
  }

  decompress(compressed: string): SplitsonData {
    const decompressed = decompressFromEncodedURIComponent(compressed);
    const parts = decompressed.split(SECTION_DELIMITER);
    const users = this.codec.decodeUsers(parts[0]);
    const records = this.codec.decodeRecords(parts[1], users);
    const name = parts[2];
    const currencyProfile = this.codec.decodeCurrencyProfile(parts[3]);
    const date = parts[4] || new Date().toISOString().slice(0, 10);
    this.recalculateBalances(records);
    return new SplitsonData(users, records, name, currencyProfile, date);
  }

  private recalculateBalances(records: SplitsonData['records']) {
    records.forEach(record => {
      if (record.boughtBy.length == 0) return;
      const amount = Number((record.price / record.boughtBy.length).toFixed(2));
      record.boughtBy.forEach(user => user.balance -= amount);
    });
  }
}
