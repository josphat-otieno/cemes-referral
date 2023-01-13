import { TestBed } from '@angular/core/testing';

import { CbfService } from './cbf.service';

describe('EngieService', () => {
  let service: CbfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CbfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
