import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignUsersDialog, AssignUsersDialogInput } from '../assign-users-dialog/assign-users-dialog';
import { CurrencyProfile, Record, User } from '../dashboard/dashboard.component';
import { EditRecordDialog, EditRecordDialogResult } from '../edit-record-dialog/edit-record-dialog';
import { InsertReceiptDialog, InsertReceiptDialogResult } from '../insert-receipt-dialog/insert-receipt-dialog';
import { v4 as uuid } from 'uuid';
import { StorageService } from '../services/storage/storage.service';
import { IdManagerService } from '../services/id-manager/id-manager.service';
import { Currency } from '../app.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent {
  boughtByPrefix: string = "Kupione przez: ";
  @Input() users: User[] = [];
  @Input() records: Record[] = [];
  @Input() currencyProfile: CurrencyProfile;
  @Input() recordsDeleteState: boolean = false;
  @Input() recordsEditState: boolean = false;

  constructor(public dialog: MatDialog, private storageService: StorageService, private idManager: IdManagerService) {}

  addRecords() {
    const dialogRef = this.dialog.open(InsertReceiptDialog, {data: this.currencyProfile.paidCurrency.short, width: '90%', maxWidth: '650px', height: '90%', autoFocus: false});
    dialogRef.afterClosed().subscribe((result: InsertReceiptDialogResult) => {
      if (result) {
        result.records.forEach(newRecord => {
          this.records.push({
            id: this.idManager.incrementAndGet(), 
            "name": newRecord.name, 
            price: newRecord.price, 
            "boughtBy": []
          });
        });
        this.storageService.storeRecords(this.records);
      }
    });
  }

  assignUsers(recordId: number) {
    let record = this.records.filter(record => record.id == recordId)[0];
    const data = new AssignUsersDialogInput(this.users, record, this.currencyProfile.paidCurrency.short);
    const dialogRef = this.dialog.open(AssignUsersDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.returnOldAmout(record);
        record.boughtBy = result.selectedUsers;
        this.subtractNewAmout(record);
        this.storageService.storeData(this.users, this.records);
      }
    });
  }

  getAmountPerPerson(price: number, boughtBy: User[]) {
    if (boughtBy.length == 0) {
      return 0;
    }
    return Number((price / boughtBy.length).toFixed(2));
  }

  getUsersNames(boughtBy: User[]) {
    if (boughtBy.length == this.users.length) {
      return "wszyscy";
    }
    return boughtBy.map(user => user.name).join(", ")
  }

  deleteRecord(record: Record) {
    const index = this.records.map(record => record.id).indexOf(record.id, 0);
    if (index > -1) {
      this.returnOldAmout(record);
      this.records.splice(index, 1);
      this.storageService.storeData(this.users, this.records);
    }
  }

  editRecord(record: Record) {
    const dialogRef = this.dialog.open(EditRecordDialog, {data: record, width: '90%', maxWidth: '650px', autoFocus: false});
    dialogRef.afterClosed().subscribe((result: EditRecordDialogResult) => {
      if (result) {
        this.returnOldAmout(record);
        record.name = result.recordName;
        record.price = Number(result.recordPrice);
        this.subtractNewAmout(record);
        this.storageService.storeData(this.users, this.records);
      }
    });
  }

  returnOldAmout(record: Record) {
    let amount = this.getAmountPerPerson(record.price, record.boughtBy);
    console.log("returning : " + amount)
    console.log("record.boughtBy : " + record.boughtBy)
    record.boughtBy.forEach(user => {
      user.balance = user.balance + amount
    });
  }

  subtractNewAmout(record: Record) {
    let amount = this.getAmountPerPerson(record.price, record.boughtBy);
    record.boughtBy.forEach(user => user.balance = user.balance - amount);
  }

  getPriceSum() {
    return this.records.map(record => record.price).reduce((sum, current) => sum + current, 0);
  }

  getAssignedRecordsNumber() {
    return this.records.filter(record => record.boughtBy.length > 0).length;
  }
}