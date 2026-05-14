import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare const require: any;
import { generateDayData, generateHistoricalData } from '../../../../services/simulator.js';
import { insertHeartRateData, insertActivityData, insertSleepData } from '../../../../services/healthDataService.js';
import { insertAlerts } from '../../../../services/alertService.js';
import { getConnectedDevice, updateLastSync, disconnectDevice } from '../../../../services/deviceService.js';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  device: any = null;
  syncing = false;
  cronRunning = false;
  showConfirm = false;
  toast: any = null;
  cronDayOffset = 0;

  permissionLabels: any = {
    frecuencia_cardiaca: 'Frecuencia Cardíaca',
    actividad: 'Actividad Física',
    sueno: 'Datos de Sueño',
    sensores: 'Sensores de Movimiento',
  };

  constructor(private router: Router) {}

  async ngOnInit() {
    this.device = await getConnectedDevice();
    if (!this.device) {
      this.router.navigate(['/conectar']);
    }
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => {
      this.toast = null;
    }, 3000);
  }

  async handleResync() {
    if (!this.device) return;
    this.syncing = true;
    try {
      const data = generateHistoricalData(14);

      await Promise.all([
        insertHeartRateData(this.device.id, data.lecturasBPM),
        insertActivityData(this.device.id, data.actividades),
        insertSleepData(this.device.id, data.suenos),
        insertAlerts(this.device.id, data.alertas),
        updateLastSync(this.device.id),
      ]);

      this.showToast('Sincronización completada', 'success');
      this.device = await getConnectedDevice(); // Refresh
    } catch (err) {
      this.showToast('Error en la sincronización', 'error');
    } finally {
      this.syncing = false;
    }
  }

  async handleCronMidnight() {
    if (!this.device) return;
    this.cronRunning = true;
    try {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + this.cronDayOffset + 1);
      const dayData = generateDayData(nextDay);

      await Promise.all([
        insertHeartRateData(this.device.id, dayData.lecturasBPM),
        insertActivityData(this.device.id, [dayData.actividad]),
        insertSleepData(this.device.id, [dayData.sueno]),
        insertAlerts(this.device.id, dayData.alertas),
        updateLastSync(this.device.id),
      ]);

      this.cronDayOffset += 1;
      this.showToast(`Día ${nextDay.toLocaleDateString('es-MX')} generado exitosamente`, 'success');
      this.device = await getConnectedDevice(); // Refresh
    } catch (err) {
      this.showToast('Error al generar día', 'error');
    } finally {
      this.cronRunning = false;
    }
  }

  async handleDisconnect() {
    await disconnectDevice();
    this.router.navigate(['/conectar'], { replaceUrl: true });
  }

  formatDateTime(dateString: string) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatRelativeTime(dateString: string) {
    if (!dateString) return 'Nunca';
    const d = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'hace un momento';
    if (diff < 3600000) return `hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `hace ${Math.floor(diff / 3600000)} h`;
    return `hace ${Math.floor(diff / 86400000)} d`;
  }
}
