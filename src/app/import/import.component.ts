import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SplitsonData, User } from '../model/splitson.model';
import { CompressorService } from '../services/compressor/compressor.service';
import { StorageService } from '../services/storage/storage.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {
  splitsonData: SplitsonData | null = null;
  priceSum: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private compressor: CompressorService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.splitsonData = this.compressor.decompress(params['data']);
        this.priceSum = this.splitsonData.records.reduce((sum, r) => sum + r.price, 0);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  import() {
    if (this.splitsonData) {
      this.storageService.save(this.splitsonData);
    }
    this.router.navigate(['/']);
  }

  reject() {
    this.router.navigate(['/']);
  }

  getUsersNamesLabel(): string {
    if (!this.splitsonData || this.splitsonData.users.length === 0) return '';
    return this.splitsonData.users.map((u: User) => u.name).join(', ');
  }

  getFormattedDate(): string {
    const dateStr = this.splitsonData?.date;
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
  }

  getAssignedCount(): number {
    return this.splitsonData?.records.filter(r => r.boughtBy.length > 0).length ?? 0;
  }

  getPaidSum(): number {
    return this.splitsonData?.users.reduce((sum, u) => sum - u.balance, 0) ?? 0;
  }
}
