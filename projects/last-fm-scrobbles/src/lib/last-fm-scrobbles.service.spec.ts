import { TestBed } from '@angular/core/testing';

import { LastFmScrobblesService } from './last-fm-scrobbles.service';

describe('LastFmScrobblesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastFmScrobblesService = TestBed.get(LastFmScrobblesService);
    expect(service).toBeTruthy();
  });
});
