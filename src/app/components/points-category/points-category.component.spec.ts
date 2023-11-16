import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsCategoryComponent } from './points-category.component';

describe('PointsCategoryComponent', () => {
  let component: PointsCategoryComponent;
  let fixture: ComponentFixture<PointsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
