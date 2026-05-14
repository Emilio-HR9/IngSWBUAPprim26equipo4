import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-heart-rate-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './heart-rate-chart.component.html',
})
export class HeartRateChartComponent implements OnChanges {
  @Input() data: any[] = [];
  range = '7d';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: []
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
      line: { tension: 0.4, borderWidth: 2 }
    },
    scales: {
      x: {
        grid: { color: '#334155' },
        ticks: { color: '#64748b', maxTicksLimit: 7 }
      },
      y: {
        min: 40,
        max: 200,
        grid: { color: '#334155' },
        ticks: { color: '#64748b' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} BPM`
        }
      }
    }
  };

  ngOnChanges() {
    this.updateChart();
  }

  setRange(r: string) {
    this.range = r;
    this.updateChart();
  }

  updateChart() {
    if (!this.data || this.data.length === 0) {
      this.lineChartData = { datasets: [], labels: [] };
      return;
    }

    const now = new Date();
    let cutoff: Date;
    if (this.range === '24h') {
      cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (this.range === '7d') {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filtered = this.data
      .filter(d => new Date(d.registrado_en) >= cutoff)
      .sort((a, b) => new Date(a.registrado_en).getTime() - new Date(b.registrado_en).getTime());

    this.lineChartData = {
      labels: filtered.map(d => new Date(d.registrado_en).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })),
      datasets: [
        {
          data: filtered.map(d => d.bpm),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: 'origin',
          pointRadius: 0
        }
      ]
    };
  }
}
