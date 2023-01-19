import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStaffListComponent } from './pending-staff-list.component';

describe('PendingStaffListComponent', () => {
  let component: PendingStaffListComponent;
  let fixture: ComponentFixture<PendingStaffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingStaffListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
