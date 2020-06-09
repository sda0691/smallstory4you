import { TestBed } from '@angular/core/testing';

import { MediaCategoryService } from './media-category.service';

describe('MediaCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediaCategoryService = TestBed.get(MediaCategoryService);
    expect(service).toBeTruthy();
  });
});
