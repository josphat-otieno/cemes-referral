import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPaymentsComponent } from './general-payments.component';

describe('GeneralPaymentsComponent', () => {
  let component: GeneralPaymentsComponent;
  let fixture: ComponentFixture<GeneralPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
