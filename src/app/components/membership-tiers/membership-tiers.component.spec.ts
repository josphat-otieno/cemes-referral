import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipTiersComponent } from './membership-tiers.component';

describe('MembershipTiersComponent', () => {
  let component: MembershipTiersComponent;
  let fixture: ComponentFixture<MembershipTiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipTiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
