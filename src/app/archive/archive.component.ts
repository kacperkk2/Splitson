import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { SplitsonData } from '../model/splitson.model';
import { StorageService } from '../services/storage/storage.service';

export interface ArchiveGroup {
  formattedDate: string;
  items: { data: SplitsonData, index: number }[];
}

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent {
  archives: SplitsonData[] = [];
  activeSplitson: SplitsonData | null = null;
  archiveGroups: ArchiveGroup[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.archives = this.storageService.loadArchive();
    this.activeSplitson = this.storageService.load();
    this.buildGroups();
  }

  getCount(): string {
    return `${this.archives.length}/20`;
  }

  getFormattedDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
  }

  deleteArchive(index: number) {
    const name = this.archives[index].name;
    this.dialog.open(ConfirmDialog, {
      data: { title: 'Usuń z archiwum', text: `Usunąć "${name}"?`, color: 'warn' },
      width: '90%',
      maxWidth: '650px',
      autoFocus: false
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.archives.splice(index, 1);
        this.storageService.saveArchive(this.archives);
        this.buildGroups();
      }
    });
  }

  loadArchiveItem(index: number) {
    const name = this.archives[index].name;
    this.dialog.open(ConfirmDialog, {
      data: { title: 'Wczytaj z archiwum', text: `Wczytać "${name}"?`, color: 'primary' },
      width: '90%',
      maxWidth: '650px',
      autoFocus: false
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const toLoad = this.archives[index];
        if (this.activeSplitson) {
          this.archives[index] = this.activeSplitson;
        } else {
          this.archives.splice(index, 1);
        }
        this.storageService.saveArchive(this.archives);
        this.storageService.save(toLoad);
        this.router.navigate(['/']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  private buildGroups() {
    const map = new Map<string, ArchiveGroup>();
    this.archives.forEach((data, index) => {
      const date = data.date ?? '';
      if (!map.has(date)) {
        map.set(date, { formattedDate: this.getFormattedDate(date), items: [] });
      }
      map.get(date)!.items.push({ data, index });
    });
    // Dates already in descending order (newest first) due to unshift in archiveCurrent
    this.archiveGroups = Array.from(map.values());
  }
}
