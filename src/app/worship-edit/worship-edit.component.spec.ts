import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorshipEditComponent } from './worship-edit.component';

describe('WorshipEditComponent', () => {
  let component: WorshipEditComponent;
  let fixture: ComponentFixture<WorshipEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorshipEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorshipEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
