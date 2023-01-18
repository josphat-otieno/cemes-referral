import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersPromotionsAwarenessComponent } from './offers-promotions-awareness.component';

describe('OffersPromotionsAwarenessComponent', () => {
  let component: OffersPromotionsAwarenessComponent;
  let fixture: ComponentFixture<OffersPromotionsAwarenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersPromotionsAwarenessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersPromotionsAwarenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
