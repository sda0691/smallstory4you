import { TestBed } from '@angular/core/testing';

import { MdeiaService } from './media.service';

describe('MdeiaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MdeiaService = TestBed.get(MdeiaService);
    expect(service).toBeTruthy();
  });
});
