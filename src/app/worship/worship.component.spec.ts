import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorshipComponent } from './worship.component';

describe('WorshipComponent', () => {
  let component: WorshipComponent;
  let fixture: ComponentFixture<WorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
