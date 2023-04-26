import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormFeedbacksComponent } from './custom-form-feedbacks.component';

describe('CustomFormFeedbacksComponent', () => {
  let component: CustomFormFeedbacksComponent;
  let fixture: ComponentFixture<CustomFormFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomFormFeedbacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
