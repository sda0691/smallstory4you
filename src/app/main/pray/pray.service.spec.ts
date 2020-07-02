import { TestBed } from '@angular/core/testing';

import { PrayService } from './pray.service';

describe('PrayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrayService = TestBed.get(PrayService);
    expect(service).toBeTruthy();
  });
});
