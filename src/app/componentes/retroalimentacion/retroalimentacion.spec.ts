import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetroalimentacionComponent } from './retroalimentacion';

describe('Retroalimentacion', () => {
  let component: RetroalimentacionComponent;
  let fixture: ComponentFixture<RetroalimentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetroalimentacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetroalimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
