import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastFmScrobblesComponent } from './last-fm-scrobbles.component';

describe('LastFmScrobblesComponent', () => {
  let component: LastFmScrobblesComponent;
  let fixture: ComponentFixture<LastFmScrobblesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastFmScrobblesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastFmScrobblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
