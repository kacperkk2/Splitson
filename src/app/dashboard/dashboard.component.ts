import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { EditUsersDialog, EditUsersDialogInput, EditUsersDialogResult } from '../edit-users-dialog/edit-users-dialog';
import { StorageService, StorageServiceModel } from '../services/storage/storage.service';
import { Buffer } from "buffer";
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { IdManagerService } from '../services/id-manager/id-manager.service';
import { CodecService } from '../services/codec/codec.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadedSplitsonDialog, LoadedSplitsonDialogInput } from '../loaded-splitson-dialog/loaded-splitson-dialog';
import { ShareLinkDialog, ShareLinkDialogInput } from '../share-link-dialog/share-link-dialog';
import { Currency, CurrencySettings, DEFAULT_NAME } from '../app.component';
import { ShortUrlServiceService } from '../services/short-url/short-url-service.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  users: User[] = [];
  records: Record[] = [];
  currencyProfile: CurrencyProfile = this.getCurrencyProfile(CurrencySettings.default, 1, CurrencySettings.default);
  mainName: string = DEFAULT_NAME;

  constructor(public dialog: MatDialog, 
    private storageService: StorageService, 
    private idManager: IdManagerService,
    private codec: CodecService,
    private router: Router,
    private route: ActivatedRoute,
    private shortUrlService: ShortUrlServiceService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=> {
      if (params['users'] && params['records'] && params['name'] && params['currency']) {
        this.loadFromUrlAfterDialog(params['users'], params['records'], params['name'], params['currency']);
      }
      else {
        this.loadFromStore();
      }
      this.idManager.init(this.records);
    });
  }

  loadFromStore() {
    let data: StorageServiceModel = this.storageService.load();
    this.users = data.users;
    this.records = data.records;
    this.mainName = data.name;
    this.currencyProfile = data.currencyProfile;
  }

  loadFromUrlAfterDialog(usersText: string, recordsText: string, nameText: string, currencyProfileText: string) {
    const data: LoadedSplitsonDialogInput = this.loadFromUrl(usersText, recordsText, nameText, currencyProfileText);
    const dialogRef = this.dialog.open(LoadedSplitsonDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.storageService.storeAll(data.users, data.records, data.name, data.currencyProfile);
        }
        this.router.navigate([], { queryParams: {} });
    });
  }

  loadFromUrl(usersText: string, recordsText: string, nameText: string, currencyProfileText: string) {
    const decompressedUsers = decompressFromBase64(usersText);
    const decompressedRecords = decompressFromBase64(recordsText);
    const decompressedCurrencyProfile = decompressFromBase64(currencyProfileText);
    const name = decompressFromBase64(nameText);
    const users = this.codec.decodeUsers(decompressedUsers);
    return new LoadedSplitsonDialogInput(
      users, 
      this.codec.decodeRecords(decompressedRecords, users),
      name,
      this.codec.decodeCurrencyProfile(decompressedCurrencyProfile))
  }

  share() {
    const compressedEncodedData = this.getCompressedEncodedData();
    const baseUrl = location.origin + "/Splitson"; // need to add splitson because of github pages
    const longUrl = baseUrl 
        + "?name=" + compressedEncodedData.name 
        + "&users=" + compressedEncodedData.users
        + "&records=" + compressedEncodedData.records
        + "&currency=" + compressedEncodedData.currencyProfile;
    
    const encodedUrl = encodeURIComponent(longUrl);
    this.shortUrlService.getShortUrl(encodedUrl).subscribe((response) => {
      let shortUrl = "";
      if (response.shorturl) {
        shortUrl = response.shorturl;
      }
      const data = new ShareLinkDialogInput(shortUrl, longUrl);
      const dialogRef = this.dialog.open(ShareLinkDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
      dialogRef.afterClosed().subscribe();
    });
  }

  getCompressedEncodedData() {
    const recordsText = this.codec.encodeRecords(this.records, this.users);
    const usersText = this.codec.encodeUsers(this.users);
    const currencyProfileText = this.codec.encodeCurrencyProfile(this.currencyProfile);
    const compressedUsers = compressToBase64(usersText);
    const compressedRecords = compressToBase64(recordsText);
    const compressedName = compressToBase64(this.mainName);
    const compressedCurrencyProfile = compressToBase64(currencyProfileText);
    return {
      users: encodeURIComponent(compressedUsers),
      records: encodeURIComponent(compressedRecords),
      name: encodeURIComponent(compressedName),
      currencyProfile: encodeURIComponent(compressedCurrencyProfile),
    }
  }
  
  editUsers() {
    const previousUserNames = this.users.map(user => user.name);
    const data = new EditUsersDialogInput(this.users, this.mainName, this.currencyProfile)
    const dialogRef = this.dialog.open(EditUsersDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe((result: EditUsersDialogResult) => {
      if (result.clearAllData) {
        this.clearAllData();
      }
      else if (result.clearRecords) {
        this.clearRecords();
      }
      else {
        this.users = result.users;
        this.mainName = result.mainName;
        const currentUserNames = this.users.map(user => user.name);
        let deletedUsers = previousUserNames.filter(item => currentUserNames.indexOf(item) < 0);
        if (deletedUsers.length > 0) {
          this.removeDeletedUsersFromRecords(deletedUsers);
        }
      }
      this.storageService.storeAll(this.users, this.records, this.mainName, this.currencyProfile);
    });
  }

  removeDeletedUsersFromRecords(deletedUsers: string[]) {
    this.records
      .forEach(record => {
        const filteredOut = record.boughtBy.filter(user => !deletedUsers.includes(user.name));
        record.boughtBy = filteredOut;
    })
  }

  getUsersNamesLabel(users: User[]) {
    if (users.length == 0) {
      return "Kliknij żeby dodać użytkowników"
    }
    return users.map(user => user.name).join(", ")
  }

  clearAllData() {
    this.records = [];
    this.users = [];
    this.mainName = DEFAULT_NAME;
    this.currencyProfile = this.getCurrencyProfile(CurrencySettings.default, 1, CurrencySettings.default);
    this.idManager.clear();
  }

  clearRecords() {
    this.records = [];
    this.users.forEach(user => user.balance = 0);
    this.idManager.clear();
  }

  getCurrencyProfile(paidCurrencyName: string, exchangeRate: number, targetCurrencyName: string) {
    return {
      paidCurrency: CurrencySettings.all.get(paidCurrencyName)!,
      exchangeRate: exchangeRate,
      targetCurrency: CurrencySettings.all.get(targetCurrencyName)!,
    };
  }
}

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