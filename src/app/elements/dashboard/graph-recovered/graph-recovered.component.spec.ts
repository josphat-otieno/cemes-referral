import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphRecoveredComponent } from './graph-recovered.component';

describe('GraphRecoveredComponent', () => {
  let component: GraphRecoveredComponent;
  let fixture: ComponentFixture<GraphRecoveredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphRecoveredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphRecoveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
