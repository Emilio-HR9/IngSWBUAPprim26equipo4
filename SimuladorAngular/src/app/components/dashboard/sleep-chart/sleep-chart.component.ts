import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-sleep-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './sleep-chart.component.html',
})
export class SleepChartComponent implements OnChanges {
  @Input() data: any[] = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [],
    labels: []
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { color: '#334155' },
        ticks: { color: '#64748b' }
      },
      y: {
        stacked: true,
        min: 0,
        max: 12,
        grid: { color: '#334155' },
        ticks: { color: '#64748b' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#cbd5e1' }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}h`
        }
      }
    }
  };

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    if (!this.data || this.data.length === 0) {
      this.barChartData = { datasets: [], labels: [] };
      return;
    }

    const chartData = this.data.slice(-14).map(d => ({
      fecha: d.fecha,
      label: new Date(d.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short' }),
      ligero: parseFloat((d.sueno_ligero_min / 60).toFixed(1)),
      profundo: parseFloat((d.sueno_profundo_min / 60).toFixed(1)),
      rem: parseFloat((d.sueno_rem_min / 60).toFixed(1)),
    }));

    this.barChartData = {
      labels: chartData.map(d => d.label),
      datasets: [
        {
          data: chartData.map(d => d.ligero),
          label: 'Ligero',
          backgroundColor: '#93c5fd',
          stack: 'a',
          maxBarThickness: 40
        },
        {
          data: chartData.map(d => d.profundo),
          label: 'Profundo',
          backgroundColor: '#1e40af',
          stack: 'a',
          maxBarThickness: 40
        },
        {
          data: chartData.map(d => d.rem),
          label: 'REM',
          backgroundColor: '#8b5cf6',
          stack: 'a',
          borderRadius: { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 },
          maxBarThickness: 40
        }
      ]
    };
  }
}
