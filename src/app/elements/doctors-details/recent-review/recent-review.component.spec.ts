import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentReviewComponent } from './recent-review.component';

describe('RecentReviewComponent', () => {
  let component: RecentReviewComponent;
  let fixture: ComponentFixture<RecentReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
