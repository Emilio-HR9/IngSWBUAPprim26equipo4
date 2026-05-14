import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-permissions.component.html',
})
export class DevicePermissionsComponent implements OnInit {
  device: any;
  email: string = '';

  permissions = [
    {
      id: 'frecuencia_cardiaca',
      label: 'Frecuencia Cardíaca',
      description: 'Lecturas de BPM y variabilidad (HRV)',
      required: true,
    },
    {
      id: 'actividad',
      label: 'Actividad Física',
      description: 'Pasos, calorías y distancia diaria',
      required: false,
    },
    {
      id: 'sueno',
      label: 'Datos de Sueño',
      description: 'Duración y fases del sueño',
      required: false,
    },
    {
      id: 'sensores',
      label: 'Sensores de Movimiento',
      description: 'Acelerómetro y giroscopio',
      required: false,
    },
  ];

  selected: string[] = [];

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.device = nav.extras.state['device'];
      this.email = nav.extras.state['email'];
    }
  }

  ngOnInit() {
    if (!this.device) {
      this.router.navigate(['/conectar']);
      return;
    }
    this.selected = this.permissions.map(p => p.id);
  }

  togglePermission(id: string) {
    const perm = this.permissions.find(p => p.id === id);
    if (perm?.required) return;

    if (this.selected.includes(id)) {
      this.selected = this.selected.filter(p => p !== id);
    } else {
      this.selected.push(id);
    }
  }

  cancel() {
    this.router.navigate(['/conectar']);
  }

  handleAuthorize() {
    this.router.navigate(['/conectar/sync'], {
      state: { device: this.device, email: this.email, permisos: this.selected },
    });
  }
}
