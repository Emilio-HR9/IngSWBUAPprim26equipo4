import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private timer: any;

  constructor(private router: Router) {
    this.verificarSesion();
  }

  iniciarSesion() {
    const now = new Date().getTime();
    localStorage.setItem('login_time', now.toString());
    this.configurarTimer(3600000); // 60 minutos
  }

  verificarSesion() {
    const loginTime = localStorage.getItem('login_time');
    if (loginTime) {
      const elapsed = new Date().getTime() - parseInt(loginTime);
      const remaining = 3600000 - elapsed;
      if (remaining <= 0) {
        this.logout();
      } else {
        this.configurarTimer(remaining);
      }
    }
  }

  private configurarTimer(ms: number) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.logout(), ms);
  }

  logout() {
    localStorage.removeItem('login_time');
    alert('Sesión de fisioterapia expirada por seguridad. Tu progreso se guardó.');
    this.router.navigate(['/login']);
  }
}
