import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modulo4Presentacion } from './modulo4-presentacion';

describe('Modulo4Presentacion', () => {
  let component: Modulo4Presentacion;
  let fixture: ComponentFixture<Modulo4Presentacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modulo4Presentacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Modulo4Presentacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
