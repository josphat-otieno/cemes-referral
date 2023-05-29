import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPaymentsComponent } from './event-payments.component';

describe('EventPaymentsComponent', () => {
  let component: EventPaymentsComponent;
  let fixture: ComponentFixture<EventPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
