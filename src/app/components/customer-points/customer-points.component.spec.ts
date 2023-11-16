import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPointsComponent } from './customer-points.component';

describe('CustomerPointsComponent', () => {
  let component: CustomerPointsComponent;
  let fixture: ComponentFixture<CustomerPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
