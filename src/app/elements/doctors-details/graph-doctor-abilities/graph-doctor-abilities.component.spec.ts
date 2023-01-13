import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphDoctorAbilitiesComponent } from './graph-doctor-abilities.component';

describe('GraphDoctorAbilitiesComponent', () => {
  let component: GraphDoctorAbilitiesComponent;
  let fixture: ComponentFixture<GraphDoctorAbilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphDoctorAbilitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphDoctorAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
