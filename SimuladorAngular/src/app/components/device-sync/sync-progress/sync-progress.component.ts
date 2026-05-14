import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Usamos any para evitar errores de compilacion TS estrictos con los JS copiados
// ya que allowJs esta desactivado o no configurado en tsconfig
declare const require: any;
import { generateHistoricalData } from '../../../../services/simulator.js';
import { insertDevice } from '../../../../services/deviceService.js';
import { insertHeartRateData, insertActivityData, insertSleepData } from '../../../../services/healthDataService.js';
import { insertAlerts } from '../../../../services/alertService.js';

const SYNC_STEPS = [
  { label: 'Conectando con {marca} API...', duration: 500 },
  { label: 'Autenticación exitosa', duration: 500 },
  { label: 'Descargando datos históricos (30 días)...', duration: 3000, hasProgress: true },
  { label: 'Almacenando en base de datos...', duration: 1000 },
  { label: 'Configurando sincronización automática...', duration: 500 },
  { label: 'Sincronización completada', duration: 0 },
];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Component({
  selector: 'app-sync-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sync-progress.component.html',
})
export class SyncProgressComponent implements OnInit, OnDestroy {
  device: any;
  email: string = '';
  permisos: string[] = [];

  currentStep = -1;
  progress = 0;
  completed = false;
  error: string | null = null;
  syncSteps = SYNC_STEPS;
  private cancelled = false;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.device = nav.extras.state['device'];
      this.email = nav.extras.state['email'];
      this.permisos = nav.extras.state['permisos'] || [];
    }
  }

  ngOnInit() {
    if (!this.device) {
      this.router.navigate(['/conectar']);
      return;
    }
    this.runSync();
  }

  ngOnDestroy() {
    this.cancelled = true;
  }

  async runSync() {
    try {
      // Paso 0
      this.currentStep = 0;
      await delay(500);
      if (this.cancelled) return;

      // Paso 1
      this.currentStep = 1;
      await delay(500);
      if (this.cancelled) return;

      // Paso 2
      this.currentStep = 2;
      const data = generateHistoricalData(30);

      // Simula progreso
      for (let i = 0; i <= 100; i += 2) {
        if (this.cancelled) return;
        this.progress = i;
        await delay(50);
      }
      if (this.cancelled) return;

      // Paso 3
      this.currentStep = 3;
      const deviceRecord = await insertDevice({
        nombre: this.device.nombre,
        marca: this.device.marca,
        modelo: this.device.modelo,
        email_cuenta: this.email,
        permisos_otorgados: this.permisos,
      });

      if (!deviceRecord) {
        this.error = 'Error al guardar el dispositivo.';
        return;
      }

      await Promise.all([
        insertHeartRateData(deviceRecord.id, data.lecturasBPM),
        insertActivityData(deviceRecord.id, data.actividades),
        insertSleepData(deviceRecord.id, data.suenos),
        insertAlerts(deviceRecord.id, data.alertas),
      ]);
      if (this.cancelled) return;
      await delay(1000);
      if (this.cancelled) return;

      // Paso 4
      this.currentStep = 4;
      await delay(500);
      if (this.cancelled) return;

      // Paso 5
      this.currentStep = 5;
      this.completed = true;

    } catch (err) {
      console.error('Error en sincronizacion:', err);
      this.error = 'Error durante la sincronización.';
    }
  }

  goToDashboard() {
    window.location.href = '/dashboard';
  }

  retry() {
    this.router.navigate(['/conectar']);
  }

  getStepLabel(step: any) {
    return step.label.replace('{marca}', this.device?.marca || '');
  }
}
