import { TestBed } from '@angular/core/testing';

import { PraiseService } from './praise.service';

describe('PraiseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PraiseService = TestBed.get(PraiseService);
    expect(service).toBeTruthy();
  });
});
