import { TestBed } from '@angular/core/testing';

import { BooksCreateService } from './books-create-service';

describe('BooksCreateService', () => {
  let service: BooksCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
