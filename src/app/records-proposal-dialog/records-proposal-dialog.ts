import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../dashboard/dashboard.component';
import { MatListOption } from '@angular/material/list';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'records-proposal-dialog',
  templateUrl: 'records-proposal-dialog.html'
})
export class RecordsProposalDialog {

    constructor(
        public dialogRef: MatDialogRef<RecordsProposalDialog>, 
        @Inject(MAT_DIALOG_DATA) public records: RecordProposal[]
        ) {
    }
}

export interface RecordProposal {
  name: string;
  price: number;
}