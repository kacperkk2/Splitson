import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_NAME } from '../app.component';

@Component({
  selector: 'new-splitson-dialog',
  templateUrl: 'new-splitson-dialog.html',
  styleUrls: ['new-splitson-dialog.scss']
})
export class NewSplitsonDialog {
    newSplitsonForm: FormGroup;
    maxLength: number = 40;
    keepUsers: boolean = true;
    keepCurrencies: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<NewSplitsonDialog>
        ) {
        this.newSplitsonForm = new FormGroup({
            name: new FormControl(DEFAULT_NAME, [Validators.required, Validators.maxLength(this.maxLength)])
        });
    }

    clear() {
        this.newSplitsonForm.controls["name"].patchValue("");
    }

    save() {
        const result = new NewSplitsonDialogResult(
            this.newSplitsonForm.get('name')!.value,
            this.keepUsers,
            this.keepCurrencies
        );
        this.dialogRef.close(result);
    }

    onBackClick(): void {
        this.dialogRef.close();
    }

    toggleKeepUsers() {
        this.keepUsers = !this.keepUsers;
    }

    toggleKeepCurrencies() {
        this.keepCurrencies = !this.keepCurrencies;
    }
}

export class NewSplitsonDialogResult {
    constructor(public name: string, public keepUsers: boolean, public keepCurrencies: boolean) {}
}