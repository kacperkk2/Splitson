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
        const dialogRef = this.dialog.open(RecordsProposalDialog, {data: records});
        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.dialogRef.close(new InsertReceiptDialogResult(records));
            }
        });
    }

    parseReceiptContent(receiptContent: string) {
        let records: RecordProposal[] = []
        receiptContent.split("\n").forEach(line => records.push({"name": line.split(" ")[0], "price": Number(line.split(" ")[1])}))
        return records;
    }

    onBackClick(): void {
        this.dialogRef.close();
    }
}

export class InsertReceiptDialogResult {
    constructor(public records: RecordProposal[]) {}
}