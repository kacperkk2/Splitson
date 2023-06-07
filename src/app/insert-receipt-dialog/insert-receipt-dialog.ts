import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../dashboard/dashboard.component';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecordProposal, RecordsProposalDialog } from '../records-proposal-dialog/records-proposal-dialog';

@Component({
  selector: 'insert-receipt-dialog',
  templateUrl: 'insert-receipt-dialog.html'
})
export class InsertReceiptDialog {
    receiptForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<InsertReceiptDialog>, 
        @Inject(MAT_DIALOG_DATA) public content: string,
        public dialog: MatDialog
        ) {
        this.receiptForm = new FormGroup({
            content: new FormControl(content, [Validators.required])
        });
    }

    processReceipt() {
        const receiptContent = this.receiptForm.get('content')!.value as string;
        let records = this.parseReceiptContent(receiptContent);
        const dialogRef = this.dialog.open(RecordsProposalDialog, {data: records, width: '90%', maxWidth: '650px', autoFocus: false});
        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.dialogRef.close(new InsertReceiptDialogResult(records));
            }
        });
    }

    parseReceiptContent(receiptContent: string) {
        let records: RecordProposal[] = []
        receiptContent.split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .forEach(line => {
                let data = line.trim().split(" ");
                let price = data.pop();
                if (price) {
                    if (price.length == 1 && !Number(price)) { // its not the price, its char at the end
                        price = data.pop();
                    }
                    price = price?.split(",").join(".");
                    if (!Number(price)) { // char at the end is at the end of number without space
                        price = price?.slice(0, -1)
                    }
                    else if (price?.split(".")[1]?.length == 3) { // char at the end was loaded wrong (as a number like B as 8)
                        price = price?.slice(0, -1)
                    }
                    records.push({"name": data.join(" "), "price": Number(price)})
                }
            });
        return records;
    }

    onBackClick(): void {
        this.dialogRef.close();
    }
}

export class InsertReceiptDialogResult {
    constructor(public records: RecordProposal[]) {}
}