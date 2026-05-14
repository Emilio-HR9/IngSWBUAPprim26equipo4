import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './metric-card.component.html',
})
export class MetricCardComponent implements OnChanges {
  @Input() title = '';
  @Input() value: string | number = '--';
  @Input() unit = '';
  @Input() icon = '';
  @Input() color = '#10b981';
  @Input() alertColor: string | null = null;
  @Input() sparklineData: any[] = [];
  @Input() changePercent: number | null | undefined = null;

  accentColor = '#10b981';
  safeIcon: SafeHtml = '';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: []
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: { radius: 0 },
      line: { tension: 0.4, borderWidth: 1.5 }
    },
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    layout: { padding: 0 }
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    this.accentColor = this.alertColor || this.color;
    if (this.icon) {
      this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
    }
    if (this.sparklineData && this.sparklineData.length > 0) {
      this.lineChartData = {
        datasets: [
          {
            data: this.sparklineData,
            borderColor: this.accentColor,
            backgroundColor: this.accentColor + '20',
            fill: true,
            borderWidth: 1.5,
            tension: 0.4,
            pointRadius: 0
          }
        ],
        labels: this.sparklineData.map((_, i) => i.toString())
      };
    }
  }

  getChangeClass() {
    if (this.changePercent === null || this.changePercent === undefined) return 'text-slate-400 bg-slate-700';
    if (this.changePercent > 0) return 'text-emerald-400 bg-emerald-500/10';
    if (this.changePercent < 0) return 'text-red-400 bg-red-500/10';
    return 'text-slate-400 bg-slate-700';
  }

  getChangeText() {
    if (this.changePercent === null || this.changePercent === undefined) return '';
    return (this.changePercent > 0 ? '+' : '') + Math.round(this.changePercent) + '%';
  }
}
