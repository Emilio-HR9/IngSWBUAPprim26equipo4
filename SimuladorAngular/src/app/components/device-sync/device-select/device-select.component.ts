import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-select.component.html',
})
export class DeviceSelectComponent {
  devices = [
    {
      id: 'samsung',
      nombre: 'Samsung Galaxy Watch 5',
      marca: 'Samsung',
      color: 'from-blue-600 to-blue-800',
    },
    {
      id: 'xiaomi',
      nombre: 'Xiaomi Mi Band 7',
      marca: 'Xiaomi',
      color: 'from-orange-500 to-orange-700',
    },
    {
      id: 'generico',
      nombre: 'Dispositivo Genérico',
      marca: 'Genérico',
      color: 'from-slate-500 to-slate-700',
    },
  ];

  selected: string | null = null;

  constructor(private router: Router) {}

  selectDevice(id: string) {
    this.selected = id;
  }

  handleContinue() {
    if (!this.selected) return;
    const device = this.devices.find(d => d.id === this.selected);
    this.router.navigate(['/conectar/permisos'], { state: { device: device, email: 'simulado@healthsync.com' } });
  }
}
