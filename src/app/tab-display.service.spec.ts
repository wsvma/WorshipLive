import { TestBed, inject } from '@angular/core/testing';

import { TabDisplayService } from './tab-display.service';

describe('TabDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabDisplayService]
    });
  });

  it('should be created', inject([TabDisplayService], (service: TabDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
