import { TestBed, inject } from '@angular/core/testing';

import { FeatherService } from './feather.service';

describe('FeatherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatherService]
    });
  });

  it('should be created', inject([FeatherService], (service: FeatherService) => {
    expect(service).toBeTruthy();
  }));
});
