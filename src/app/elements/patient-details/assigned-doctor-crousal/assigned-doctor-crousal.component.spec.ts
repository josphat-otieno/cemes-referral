import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedDoctorCrousalComponent } from './assigned-doctor-crousal.component';

describe('AssignedDoctorCrousalComponent', () => {
  let component: AssignedDoctorCrousalComponent;
  let fixture: ComponentFixture<AssignedDoctorCrousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedDoctorCrousalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedDoctorCrousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
