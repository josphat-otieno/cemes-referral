import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPatientsComponent } from './graph-patients.component';

describe('GraphPatientsComponent', () => {
  let component: GraphPatientsComponent;
  let fixture: ComponentFixture<GraphPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
