import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './activity-chart.component.html',
})
export class ActivityChartComponent implements OnChanges {
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
        type: 'linear',
        position: 'left',
        grid: { color: '#334155' },
        ticks: { color: '#64748b' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#64748b' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#cbd5e1' }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.yAxisID === 'y') {
              return `${context.parsed.y} pasos`;
            } else {
              return `${context.parsed.y} kcal`;
            }
          }
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
      pasos: d.pasos,
      calorias: d.calorias_kcal,
    }));

    this.barChartData = {
      labels: chartData.map(d => d.label),
      datasets: [
        {
          data: chartData.map(d => d.pasos),
          label: 'Pasos',
          backgroundColor: '#3b82f6',
          borderRadius: { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 },
          yAxisID: 'y',
          maxBarThickness: 40
        },
        {
          data: chartData.map(d => d.calorias),
          label: 'Calorías',
          backgroundColor: '#f97316',
          borderRadius: { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 },
          yAxisID: 'y1',
          maxBarThickness: 40
        }
      ]
    };
  }
}
