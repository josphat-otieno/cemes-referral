import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfanityReportComponent } from './profanity-report.component';

describe('ProfanityReportComponent', () => {
  let component: ProfanityReportComponent;
  let fixture: ComponentFixture<ProfanityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfanityReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfanityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
