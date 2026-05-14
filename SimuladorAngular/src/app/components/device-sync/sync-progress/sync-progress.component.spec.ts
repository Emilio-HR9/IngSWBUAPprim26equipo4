import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncProgressComponent } from './sync-progress.component';

describe('SyncProgressComponent', () => {
  let component: SyncProgressComponent;
  let fixture: ComponentFixture<SyncProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
