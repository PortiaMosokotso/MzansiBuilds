import { TestBed } from '@angular/core/testing';

import { CollaborationRequest } from './collaboration-request';

describe('CollaborationRequest', () => {
  let service: CollaborationRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaborationRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
