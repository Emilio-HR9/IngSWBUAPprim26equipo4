import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

declare const require: any;
import { getConnectedDevice } from '../../../../services/deviceService.js';
import { getUnreadCount } from '../../../../services/alertService.js';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  deviceName: string | null = null;
  unreadAlerts = 0;
  loading = true;

  constructor(private router: Router) {}

  async ngOnInit() {
    this.loading = true;
    const device = await getConnectedDevice();
    if (!device) {
      this.router.navigate(['/conectar']);
      return;
    }
    this.deviceName = device.nombre;
    this.unreadAlerts = await getUnreadCount(device.id);
    this.loading = false;
  }

  toggleSidebar(open: boolean) {
    this.sidebarOpen = open;
  }
}
