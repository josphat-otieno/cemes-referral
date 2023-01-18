import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSubCategoryComponent } from './business-sub-category.component';

describe('BusinessSubCategoryComponent', () => {
  let component: BusinessSubCategoryComponent;
  let fixture: ComponentFixture<BusinessSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
