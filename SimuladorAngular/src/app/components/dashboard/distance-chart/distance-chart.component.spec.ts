import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceChartComponent } from './distance-chart.component';

describe('DistanceChartComponent', () => {
  let component: DistanceChartComponent;
  let fixture: ComponentFixture<DistanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistanceChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
