import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CemesMembersComponent } from './cemes-members.component';

describe('CemesMembersComponent', () => {
  let component: CemesMembersComponent;
  let fixture: ComponentFixture<CemesMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CemesMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CemesMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
