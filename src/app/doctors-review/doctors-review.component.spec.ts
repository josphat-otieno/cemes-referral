import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsReviewComponent } from './doctors-review.component';

describe('DoctorsReviewComponent', () => {
  let component: DoctorsReviewComponent;
  let fixture: ComponentFixture<DoctorsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorsReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
