import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphVisitorsComponent } from './graph-visitors.component';

describe('GraphVisitorsComponent', () => {
  let component: GraphVisitorsComponent;
  let fixture: ComponentFixture<GraphVisitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphVisitorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
