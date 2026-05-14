import { Routes } from '@angular/router';
import { DeviceSelectComponent } from './components/device-sync/device-select/device-select.component';
import { DevicePermissionsComponent } from './components/device-sync/device-permissions/device-permissions.component';
import { SyncProgressComponent } from './components/device-sync/sync-progress/sync-progress.component';

import { LayoutComponent } from './components/layout/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { AlertsComponent } from './components/alerts/alerts/alerts.component';
import { DataTableComponent } from './components/data-views/data-table/data-table.component';
import { ManualEntryComponent } from './components/data-views/manual-entry/manual-entry.component';
import { LiveSensorsComponent } from './components/sensors/live-sensors/live-sensors.component';
import { SettingsComponent } from './components/settings/settings/settings.component';

export const routes: Routes = [
  { path: 'conectar', component: DeviceSelectComponent },
  { path: 'conectar/permisos', component: DevicePermissionsComponent },
  { path: 'conectar/sync', component: SyncProgressComponent },
  
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'alertas', component: AlertsComponent },
      { path: 'datos', component: DataTableComponent },
      { path: 'ingreso-manual', component: ManualEntryComponent },
      { path: 'sensores', component: LiveSensorsComponent },
      { path: 'configuracion', component: SettingsComponent },
    ]
  },
  
  { path: '', redirectTo: 'conectar', pathMatch: 'full' },
  { path: '**', redirectTo: 'conectar' }
];
