import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SplitsonData } from '../model/splitson.model';

@Component({
  selector: 'app-archive-tile',
  templateUrl: './archive-tile.component.html',
  styleUrls: ['./archive-tile.component.scss']
})
export class ArchiveTileComponent {
  @Input() data!: SplitsonData;
  @Input() isActive: boolean = false;
  @Output() deleteClicked = new EventEmitter<void>();
  @Output() tileClicked = new EventEmitter<void>();

  getUsersLabel(): string {
    if (!this.data.users || this.data.users.length === 0) return 'Brak użytkowników';
    return this.data.users.map(u => u.name).join(', ');
  }

  getFormattedDate(): string {
    const dateStr = this.data?.date;
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
  }

  onDelete() {
    this.deleteClicked.emit();
  }
}
