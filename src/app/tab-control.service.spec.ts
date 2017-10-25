import { TestBed, inject } from '@angular/core/testing';
import { TabControlService } from './tab-control.service';

describe('TabDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabControlService]
    });
  });

  it('should be created', inject([TabControlService], (service: TabControlService) => {
    expect(service).toBeTruthy();
  }));
});
