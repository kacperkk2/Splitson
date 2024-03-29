import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTabsModule} from '@angular/material/tabs';
import { RecordsComponent } from './records/records.component';
import { SummaryComponent } from './summary/summary.component';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import { AssignUsersDialog } from './assign-users-dialog/assign-users-dialog';
import { EditUsersDialog } from './edit-users-dialog/edit-users-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TextFieldModule} from '@angular/cdk/text-field';
import { InsertReceiptDialog } from './insert-receipt-dialog/insert-receipt-dialog';
import { RecordsProposalDialog } from './records-proposal-dialog/records-proposal-dialog';
import { EditRecordDialog } from './edit-record-dialog/edit-record-dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { LoadedSplitsonDialog } from './loaded-splitson-dialog/loaded-splitson-dialog';
import { ShareLinkDialog } from './share-link-dialog/share-link-dialog';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { EditNameDialog } from './edit-name-dialog/edit-name-dialog';
import { BoughtRecordsSummaryDialog } from './bought-records-summary-dialog/bought-records-summary-dialog';
import { HttpClientModule } from '@angular/common/http';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import { NewSplitsonDialog } from './new-splitson-dialog/new-splitson-dialog';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RecordsComponent,
    SummaryComponent,
    AssignUsersDialog,
    EditUsersDialog,
    InsertReceiptDialog,
    RecordsProposalDialog,
    EditRecordDialog,
    ConfirmDialog,
    LoadedSplitsonDialog,
    ShareLinkDialog,
    EditNameDialog,
    BoughtRecordsSummaryDialog,
    NewSplitsonDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    MatCardModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FlexLayoutModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    TextFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    ClipboardModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}

