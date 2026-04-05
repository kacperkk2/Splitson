import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, timeout } from 'rxjs';
import { CurrencySettings, DEFAULT_NAME } from '../app.component';
import { EditUsersDialog, EditUsersDialogInput, EditUsersDialogResult } from '../edit-users-dialog/edit-users-dialog';
import { LoadedSplitsonDialog } from '../loaded-splitson-dialog/loaded-splitson-dialog';
import { SplitsonData, User } from '../model/splitson.model';
import { NewSplitsonDialog, NewSplitsonDialogResult } from '../new-splitson-dialog/new-splitson-dialog';
import { CompressorService } from '../services/compressor/compressor.service';
import { IdManagerService } from '../services/id-manager/id-manager.service';
import { ShortUrlServiceService } from '../services/short-url/short-url-service.service';
import { StorageService } from '../services/storage/storage.service';
import { ShareLinkDialog, ShareLinkDialogInput } from '../share-link-dialog/share-link-dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  data: SplitsonData = new SplitsonData(
    [],
    [],
    DEFAULT_NAME,
    this.getCurrencyProfile(CurrencySettings.default, 1, CurrencySettings.default),
    new Date().toISOString().slice(0, 10)
  );

  constructor(public dialog: MatDialog,
    private storageService: StorageService,
    private idManager: IdManagerService,
    private compressor: CompressorService,
    private router: Router,
    private route: ActivatedRoute,
    private shortUrlService: ShortUrlServiceService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=> {
      if (params['data']) {
        this.loadFromUrlAfterDialog(params['data']);
      } else {
        this.loadFromStore();
      }
      this.idManager.init(this.data.records);
    });
  }

  loadFromStore() {
    this.data = this.storageService.load();
  }

  loadFromUrlAfterDialog(dataParam: string) {
    const splitsonData: SplitsonData = this.compressor.decompress(dataParam);
    const dialogRef = this.dialog.open(LoadedSplitsonDialog, {data: splitsonData, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.storageService.save(splitsonData);
        }
        this.router.navigate([], { queryParams: {} });
    });
  }

  share() {
    const baseUrl = location.origin + ""; // need to add splitson because of github pages
    const longUrl = baseUrl + "?data=" + this.compressor.compress(this.data);

    const encodedUrl = encodeURIComponent(longUrl);
    this.shortUrlService.getShortUrl(encodedUrl).pipe(
      timeout(2000),
      catchError(() => of(null))
    ).subscribe((response) => {
      const shortUrl = response?.shorturl ?? "";
      const data = new ShareLinkDialogInput(this.data.name, shortUrl, longUrl);
      const dialogRef = this.dialog.open(ShareLinkDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
      dialogRef.afterClosed().subscribe();
    });
  }
  
  editUsers() {
    const previousUserNames = this.data.users.map(user => user.name);
    const dialogInput = new EditUsersDialogInput(this.data.users, this.data.name, this.data.currencyProfile, this.data.date, (name: string) => this.data.name = name)
    const dialogRef = this.dialog.open(EditUsersDialog, {data: dialogInput, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe((result: EditUsersDialogResult) => {
      if (result) {
        this.data.users = result.users;
        this.data.name = result.mainName;
        this.data.date = result.date;
        const currentUserNames = this.data.users.map(user => user.name);
        let deletedUsers = previousUserNames.filter(item => currentUserNames.indexOf(item) < 0);
        if (deletedUsers.length > 0) {
          this.removeDeletedUsersFromRecords(deletedUsers);
        }
        this.storageService.save(this.data);
      }
    });
  }

  removeDeletedUsersFromRecords(deletedUsers: string[]) {
    this.data.records
      .forEach(record => {
        const filteredOut = record.boughtBy.filter(user => !deletedUsers.includes(user.name));
        record.boughtBy = filteredOut;
    })
  }

  getFormattedDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = String(day).padStart(2, '0');
    const m = String(month).padStart(2, '0');
    return `${d}.${m}.${year}`;
  }

  getUsersNamesLabel(users: User[]) {
    if (users.length == 0) {
      return "Kliknij żeby dodać użytkowników"
    }
    return users.map(user => user.name).join(", ")
  }

  clearRecords() {
    this.data.records = [];
    this.data.users.forEach(user => user.balance = 0);
    this.idManager.clear();
  }

  getCurrencyProfile(paidCurrencyName: string, exchangeRate: number, targetCurrencyName: string) {
    return {
      paidCurrency: CurrencySettings.all.get(paidCurrencyName)!,
      exchangeRate: exchangeRate,
      targetCurrency: CurrencySettings.all.get(targetCurrencyName)!,
    };
  }

  newSplitson() {
    const dialogRef = this.dialog.open(NewSplitsonDialog, {width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe((result: NewSplitsonDialogResult) => {
      if (result) {
        this.data.name = result.name;
        this.data.date = result.date;
        if (!result.keepUsers) {
          this.data.users = [];
        }
        if (!result.keepCurrencies) {
          this.data.currencyProfile = this.getCurrencyProfile(CurrencySettings.default, 1, CurrencySettings.default);
        }
        this.clearRecords();
        this.storageService.save(this.data);
      }
    });
  }
}
