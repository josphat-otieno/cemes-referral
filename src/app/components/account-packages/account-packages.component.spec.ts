import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPackagesComponent } from './account-packages.component';

describe('AccountPackagesComponent', () => {
  let component: AccountPackagesComponent;
  let fixture: ComponentFixture<AccountPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
