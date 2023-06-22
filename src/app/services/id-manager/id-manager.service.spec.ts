import { TestBed } from '@angular/core/testing';
import { IdManagerService } from './id-manager.service';


describe('StorageServiceService', () => {
  let service: IdManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
