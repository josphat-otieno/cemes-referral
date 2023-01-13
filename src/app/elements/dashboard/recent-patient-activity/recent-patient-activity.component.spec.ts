import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentPatientActivityComponent } from './recent-patient-activity.component';

describe('RecentPatientActivityComponent', () => {
  let component: RecentPatientActivityComponent;
  let fixture: ComponentFixture<RecentPatientActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentPatientActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentPatientActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
