import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Importa el componente que creaste
import { Modulo4PresentacionComponent } from './componentes/modulo4-presentacion/modulo4-presentacion';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Agrégalo aquí a la lista de imports
  imports: [RouterOutlet, Modulo4PresentacionComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'modulo4-frontend';
}