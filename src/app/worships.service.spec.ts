import { TestBed, inject } from '@angular/core/testing';

import { WorshipServiceService } from './worship-service.service';

describe('WorshipServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorshipServiceService]
    });
  });

  it('should be created', inject([WorshipServiceService], (service: WorshipServiceService) => {
    expect(service).toBeTruthy();
  }));
});
