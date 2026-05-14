import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const require: any;
import { getAllDataForTable } from '../../../../services/healthDataService.js';
import { getConnectedDevice } from '../../../../services/deviceService.js';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent implements OnInit {
  deviceId: string | null = null;
  deviceName: string | null = null;
  
  data: any[] = [];
  loading = true;
  page = 0;
  pageSize = 20;
  
  filterType = '';
  startDate = '';
  endDate = '';

  typeOptions = [
    { value: '', label: 'Todos' },
    { value: 'bpm', label: 'BPM' },
    { value: 'hrv', label: 'HRV' },
    { value: 'pasos', label: 'Pasos' },
    { value: 'calorias', label: 'Calorías' },
    { value: 'distancia', label: 'Distancia' },
    { value: 'sueno', label: 'Sueño' },
  ];

  async ngOnInit() {
    this.loading = true;
    const device = await getConnectedDevice();
    if (device) {
      this.deviceId = device.id;
      this.deviceName = device.nombre;
      await this.loadData();
    }
  }

  async loadData() {
    if (!this.deviceId) return;
    this.loading = true;
    const result = await getAllDataForTable(this.deviceId, {
      tipo: this.filterType || undefined,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
    });
    this.data = result;
    this.page = 0;
    this.loading = false;
  }

  onFilterChange() {
    this.loadData();
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.pageSize);
  }

  get pageData() {
    const start = this.page * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }

  setPage(p: number) {
    this.page = p;
  }

  formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(',', '');
  }

  getDatePart(dateString: string) {
    return this.formatDateTime(dateString).split(' ')[0];
  }

  getTimePart(dateString: string) {
    return this.formatDateTime(dateString).split(' ')[1];
  }

  handleExport() {
    const csvData = this.data.map(d => ({
      fecha: this.getDatePart(d.fecha),
      hora: this.getTimePart(d.fecha),
      tipo: d.tipo,
      valor: d.valor,
      unidad: d.unidad,
      dispositivo: this.deviceName,
    }));
    
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${(row as any)[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `healthsync_datos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
