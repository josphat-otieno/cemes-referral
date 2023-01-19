import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessIntegrityRatingComponent } from './business-integrity-rating.component';

describe('BusinessIntegrityRatingComponent', () => {
  let component: BusinessIntegrityRatingComponent;
  let fixture: ComponentFixture<BusinessIntegrityRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessIntegrityRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessIntegrityRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
