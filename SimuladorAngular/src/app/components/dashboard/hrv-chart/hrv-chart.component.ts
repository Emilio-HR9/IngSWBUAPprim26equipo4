import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-hrv-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './hrv-chart.component.html',
})
export class HrvChartComponent implements OnChanges {
  @Input() data: any[] = [];

  lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: []
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: { radius: 3, backgroundColor: '#8b5cf6' },
      line: { tension: 0.4, borderWidth: 2 }
    },
    scales: {
      x: {
        grid: { color: '#334155' },
        ticks: { color: '#64748b' }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: '#334155' },
        ticks: {
          color: '#64748b',
          callback: (value) => value + ' ms'
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} ms`
        }
      }
    }
  };

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    if (!this.data || this.data.length === 0) {
      this.lineChartData = { datasets: [], labels: [] };
      return;
    }

    const byDay: any = {};
    this.data.forEach(d => {
      if (d.hrv_ms === null || d.hrv_ms === undefined) return;
      const day = d.registrado_en.split('T')[0];
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(d.hrv_ms);
    });

    const chartData = Object.entries(byDay)
      .map(([day, values]: [string, any]) => ({
        fecha: day,
        label: new Date(day + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short' }),
        hrv: parseFloat((values.reduce((a: number, b: number) => a + b, 0) / values.length).toFixed(1)),
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .slice(-14);

    if (chartData.length === 0) {
      this.lineChartData = { datasets: [], labels: [] };
      return;
    }

    this.lineChartData = {
      labels: chartData.map(d => d.label),
      datasets: [
        {
          data: chartData.map(d => d.hrv),
          borderColor: '#8b5cf6',
          backgroundColor: '#8b5cf6',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }
}
