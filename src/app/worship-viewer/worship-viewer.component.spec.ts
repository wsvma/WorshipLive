import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorshipViewerComponent } from './worship-viewer.component';

describe('WorshipViewerComponent', () => {
  let component: WorshipViewerComponent;
  let fixture: ComponentFixture<WorshipViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorshipViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorshipViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
