import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const require: any;
import { getAlerts, markAsRead } from '../../../../services/alertService.js';
import { getConnectedDevice } from '../../../../services/deviceService.js';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
})
export class AlertsComponent implements OnInit {
  alerts: any[] = [];
  loading = true;
  filter = 'todas';
  severityFilter = '';
  deviceId: string | null = null;

  severityConfig: any = {
    alta: { icon: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Alta' },
    media: { icon: '<path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Media' },
    baja: { icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>', color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/30', label: 'Baja' },
  };

  async ngOnInit() {
    this.loading = true;
    const device = await getConnectedDevice();
    if (device) {
      this.deviceId = device.id;
      await this.loadAlerts();
    }
    this.loading = false;
  }

  async loadAlerts() {
    if (this.deviceId) {
      this.alerts = await getAlerts(this.deviceId);
    }
  }

  getFilteredAlerts() {
    return this.alerts.filter(a => {
      if (this.filter === 'no_leidas' && a.leida) return false;
      if (this.severityFilter && a.severidad !== this.severityFilter) return false;
      return true;
    });
  }

  setFilter(f: string) {
    this.filter = f;
  }

  async markAlertAsRead(id: string) {
    await markAsRead(id);
    await this.loadAlerts();
  }

  formatRelativeTime(dateString: string) {
    const d = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'hace un momento';
    if (diff < 3600000) return `hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `hace ${Math.floor(diff / 3600000)} h`;
    return `hace ${Math.floor(diff / 86400000)} d`;
  }

  formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString('es-MX', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }
}
