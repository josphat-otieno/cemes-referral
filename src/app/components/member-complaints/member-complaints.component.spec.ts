import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberComplaintsComponent } from './member-complaints.component';

describe('MemberComplaintsComponent', () => {
  let component: MemberComplaintsComponent;
  let fixture: ComponentFixture<MemberComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberComplaintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
