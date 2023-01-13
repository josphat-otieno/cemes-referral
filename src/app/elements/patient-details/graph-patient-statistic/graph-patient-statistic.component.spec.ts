import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPatientStatisticComponent } from './graph-patient-statistic.component';

describe('GraphPatientStatisticComponent', () => {
  let component: GraphPatientStatisticComponent;
  let fixture: ComponentFixture<GraphPatientStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphPatientStatisticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphPatientStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
