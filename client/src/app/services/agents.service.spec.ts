import { TestBed } from '@angular/core/testing';

import { AgentsService } from './agents.service';

describe('AgentsService', () => {
  let service: AgentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
