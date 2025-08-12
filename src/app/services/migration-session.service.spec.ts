import { TestBed } from '@angular/core/testing';

import { MigrationSessionService } from './migration-session.service';

describe('MigrationSessionService', () => {
  let service: MigrationSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MigrationSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
