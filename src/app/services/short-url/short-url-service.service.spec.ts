import { TestBed } from '@angular/core/testing';

import { ShortUrlServiceService } from './short-url-service.service';

describe('ShortUrlServiceService', () => {
  let service: ShortUrlServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortUrlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
