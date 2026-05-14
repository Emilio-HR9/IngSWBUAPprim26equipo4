import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrvChartComponent } from './hrv-chart.component';

describe('HrvChartComponent', () => {
  let component: HrvChartComponent;
  let fixture: ComponentFixture<HrvChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrvChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrvChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
