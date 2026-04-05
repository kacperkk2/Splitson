import { Injectable } from '@angular/core';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { SplitsonData } from 'src/app/model/splitson.model';
import { CodecService } from '../codec/codec.service';

const SECTION_DELIMITER = '\n';

@Injectable({
  providedIn: 'root'
})
export class CompressorService {
  constructor(private codec: CodecService) {}

  compress(data: SplitsonData): string {
    const usersEncoded = this.codec.encodeUsers(data.users);
    const recordsEncoded = this.codec.encodeRecords(data.records, data.users);
    const currencyEncoded = this.codec.encodeCurrencyProfile(data.currencyProfile);
    const combined = [usersEncoded, recordsEncoded, data.name, currencyEncoded].join(SECTION_DELIMITER);
    return encodeURIComponent(compressToBase64(combined));
  }

  decompress(compressed: string): SplitsonData {
    const decompressed = decompressFromBase64(decodeURIComponent(compressed));
    const parts = decompressed.split(SECTION_DELIMITER);
    const users = this.codec.decodeUsers(parts[0]);
    const records = this.codec.decodeRecords(parts[1], users);
    const name = parts[2];
    const currencyProfile = this.codec.decodeCurrencyProfile(parts[3]);
    return new SplitsonData(users, records, name, currencyProfile);
  }
}
