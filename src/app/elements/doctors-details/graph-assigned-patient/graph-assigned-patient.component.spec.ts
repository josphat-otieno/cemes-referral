import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphAssignedPatientComponent } from './graph-assigned-patient.component';

describe('GraphAssignedPatientComponent', () => {
  let component: GraphAssignedPatientComponent;
  let fixture: ComponentFixture<GraphAssignedPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphAssignedPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphAssignedPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
