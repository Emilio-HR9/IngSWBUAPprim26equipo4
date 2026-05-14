import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-distance-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './distance-chart.component.html',
})
export class DistanceChartComponent implements OnChanges {
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
        grid: { color: '#334155' },
        ticks: { color: '#64748b' }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#334155' },
        ticks: {
          color: '#64748b',
          callback: (value) => value + ' km'
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} km`
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
      distancia: d.distancia_km,
    }));

    if (chartData.length === 0) {
      this.barChartData = { datasets: [], labels: [] };
      return;
    }

    this.barChartData = {
      labels: chartData.map(d => d.label),
      datasets: [
        {
          data: chartData.map(d => d.distancia),
          label: 'Distancia',
          backgroundColor: '#0ea5e9',
          borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
          maxBarThickness: 40
        }
      ]
    };
  }
}
