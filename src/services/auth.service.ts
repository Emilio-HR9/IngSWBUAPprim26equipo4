import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private timer: any;

  constructor(private router: Router) {}

  iniciarSesion() {
    // 1. Guardamos el inicio de sesión
    const now = new Date().getTime();
    localStorage.setItem('login_time', now.toString());

    // 2. Configuramos el cierre en 60 minutos (3600000 ms)
    this.timer = setTimeout(() => {
      this.logout();
    }, 3600000);
  }

  // Permite recuperar el estado si el usuario refresca la página
  verificarSesion() {
    const loginTime = localStorage.getItem('login_time');
    if (loginTime) {
      const elapsed = new Date().getTime() - parseInt(loginTime);
      if (elapsed > 3600000) {
        this.logout();
      } else {
        // Reiniciamos el timer con el tiempo restante
        this.timer = setTimeout(() => this.logout(), 3600000 - elapsed);
      }
    }
  }

  logout() {
    localStorage.removeItem('login_time');
    // Guardamos "donde se quedó" en una variable aparte antes de salir
    alert('Sesión expirada. Tu progreso se guardó localmente.');
    this.router.navigate(['/login']);
  }
}
