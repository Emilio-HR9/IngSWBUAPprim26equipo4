import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

declare const require: any;
import { generateSensorReading } from '../../../../services/simulator.js';

@Component({
  selector: 'app-live-sensors',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './live-sensors.component.html',
})
export class LiveSensorsComponent implements OnInit, OnDestroy {
  sensorData: any = null;
  history: any[] = [];
  estado = 'reposo';
  private intervalRef: any = null;

  accelChartData: ChartConfiguration<'line'>['data'] = { datasets: [], labels: [] };
  gyroChartData: ChartConfiguration<'line'>['data'] = { datasets: [], labels: [] };

  commonOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    elements: {
      point: { radius: 0 },
      line: { tension: 0.4, borderWidth: 1.5 }
    },
    scales: {
      x: { display: false },
      y: { grid: { color: '#334155' }, ticks: { color: '#64748b' } }
    },
    plugins: {
      legend: { labels: { color: '#cbd5e1' } }
    }
  };

  accelOptions: ChartOptions<'line'> = {
    ...this.commonOptions,
    scales: { ...this.commonOptions.scales, y: { min: -12, max: 18, grid: { color: '#334155' }, ticks: { color: '#64748b' } } }
  };

  gyroOptions: ChartOptions<'line'> = {
    ...this.commonOptions,
    scales: { ...this.commonOptions.scales, y: { min: -100, max: 100, grid: { color: '#334155' }, ticks: { color: '#64748b' } } }
  };

  ngOnInit() {
    this.startSimulation();
  }

  ngOnDestroy() {
    this.stopSimulation();
  }

  setEstado(nuevoEstado: string) {
    this.estado = nuevoEstado;
    this.history = [];
    this.stopSimulation();
    this.startSimulation();
  }

  startSimulation() {
    this.intervalRef = setInterval(() => {
      const reading = generateSensorReading(this.estado);
      const timestamp = Date.now();
      const dataPoint = { ...reading, timestamp };

      this.sensorData = dataPoint;
      
      this.history.push(dataPoint);
      if (this.history.length > 50) {
        this.history.shift();
      }

      this.updateCharts();
    }, 100);
  }

  stopSimulation() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  }

  updateCharts() {
    const labels = this.history.map((_, i) => i.toString());

    this.accelChartData = {
      labels,
      datasets: [
        { data: this.history.map(h => h.acelerometro.x), borderColor: '#ef4444', label: 'X', pointRadius: 0 },
        { data: this.history.map(h => h.acelerometro.y), borderColor: '#10b981', label: 'Y', pointRadius: 0 },
        { data: this.history.map(h => h.acelerometro.z), borderColor: '#3b82f6', label: 'Z', pointRadius: 0 }
      ]
    };

    this.gyroChartData = {
      labels,
      datasets: [
        { data: this.history.map(h => h.giroscopio.x), borderColor: '#ef4444', label: 'Roll', pointRadius: 0 },
        { data: this.history.map(h => h.giroscopio.y), borderColor: '#10b981', label: 'Pitch', pointRadius: 0 },
        { data: this.history.map(h => h.giroscopio.z), borderColor: '#3b82f6', label: 'Yaw', pointRadius: 0 }
      ]
    };
  }

  formatValue(val: number) {
    return val?.toFixed(2) || '0.00';
  }
}
