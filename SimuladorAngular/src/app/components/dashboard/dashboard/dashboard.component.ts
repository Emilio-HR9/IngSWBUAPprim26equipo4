import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MetricCardComponent } from '../metric-card/metric-card.component';
import { HeartRateChartComponent } from '../heart-rate-chart/heart-rate-chart.component';
import { ActivityChartComponent } from '../activity-chart/activity-chart.component';
import { SleepChartComponent } from '../sleep-chart/sleep-chart.component';
import { HrvChartComponent } from '../hrv-chart/hrv-chart.component';
import { DistanceChartComponent } from '../distance-chart/distance-chart.component';

declare const require: any;
import { getLatestMetrics, getRecentData } from '../../../../services/healthDataService.js';
import { getConnectedDevice } from '../../../../services/deviceService.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardComponent,
    HeartRateChartComponent,
    ActivityChartComponent,
    SleepChartComponent,
    HrvChartComponent,
    DistanceChartComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  loading = true;
  metrics: any = null;
  recentData: any = null;
  cardData: any = { bpm: {}, pasos: {}, calorias: {}, sueno: {} };

  constructor(private router: Router) {}

  async ngOnInit() {
    this.loading = true;
    const device = await getConnectedDevice();
    if (!device) {
      this.router.navigate(['/conectar']);
      return;
    }

    const [metricsData, recent] = await Promise.all([
      getLatestMetrics(device.id),
      getRecentData(device.id, 30),
    ]);
    
    this.metrics = metricsData;
    this.recentData = recent;
    this.calculateCardData(recent);
    this.loading = false;
  }

  calculateCardData(recentData: any) {
    if (!recentData) return;

    const actividades = recentData.actividades || [];
    const suenos = recentData.suenos || [];
    const bpmReadings = recentData.lecturasBPM || [];

    const bpmByDay: any = {};
    bpmReadings.forEach((r: any) => {
      const day = r.registrado_en.split('T')[0];
      if (!bpmByDay[day]) bpmByDay[day] = [];
      bpmByDay[day].push(r.bpm);
    });
    
    const bpmSparkline = Object.values(bpmByDay)
      .slice(-7)
      .map((vals: any) => Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length));

    const pasosSparkline = actividades.slice(-7).map((a: any) => a.pasos);
    const caloriasSparkline = actividades.slice(-7).map((a: any) => a.calorias_kcal);
    const suenoSparkline = suenos.slice(-7).map((s: any) => parseFloat((s.duracion_total_min / 60).toFixed(1)));

    const calcChange = (arr: any[], key: string) => {
      if (arr.length < 2) return null;
      const today = arr[arr.length - 1][key];
      const yesterday = arr[arr.length - 2][key];
      if (yesterday === 0) return null;
      return ((today - yesterday) / yesterday) * 100;
    };

    this.cardData = {
      bpm: { sparkline: bpmSparkline },
      pasos: { sparkline: pasosSparkline, change: calcChange(actividades, 'pasos') },
      calorias: { sparkline: caloriasSparkline, change: calcChange(actividades, 'calorias_kcal') },
      sueno: { sparkline: suenoSparkline },
    };
  }

  formatBPM(bpm: number) { return bpm; }
  formatSteps(steps: number) { return steps.toLocaleString('en-US'); }
  formatCalories(kcal: number) { return kcal.toLocaleString('en-US'); }
  formatSleepDuration(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  }

  getBpmColor(bpm: number) {
    if (!bpm) return '#10b981';
    if (bpm > 120 || bpm < 45) return '#ef4444';
    return '#10b981';
  }

  getStepsColor(steps: number) {
    if (!steps && steps !== 0) return '#10b981';
    if (steps < 2000) return '#ef4444';
    if (steps < 5000) return '#f59e0b';
    return '#10b981';
  }

  getSleepColor(minutes: number) {
    if (!minutes) return '#10b981';
    const hours = minutes / 60;
    if (hours < 5) return '#ef4444';
    if (hours < 7) return '#f59e0b';
    return '#10b981';
  }
}
