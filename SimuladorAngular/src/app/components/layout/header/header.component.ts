import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() deviceName: string | null = null;
  @Input() unreadAlerts: number = 0;
  @Output() menuClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  onMenuClick() {
    this.menuClick.emit();
  }

  goToAlerts() {
    this.router.navigate(['/alertas']);
  }
}
