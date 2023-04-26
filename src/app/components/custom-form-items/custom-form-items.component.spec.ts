import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormItemsComponent } from './custom-form-items.component';

describe('CustomFormItemsComponent', () => {
  let component: CustomFormItemsComponent;
  let fixture: ComponentFixture<CustomFormItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomFormItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
