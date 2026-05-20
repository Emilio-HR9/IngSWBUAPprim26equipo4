import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  // Estado inicial del proceso para el fisioterapeuta
  estadoGuardado: string = 'Esperando carga de archivos clínicos...';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // 1. Verificamos si la sesión de 60 minutos sigue vigente
    this.authService.verificarSesion();

    // 2. Recuperamos el progreso por si hubo un cierre de sesión previo
    const progresoPrevio = localStorage.getItem('ultimo_paso_clinico');
    if (progresoPrevio) {
      this.estadoGuardado = progresoPrevio;
    }
  }

  onFileSelected(event: any, tipo: string) {
    const file = event.target.files[0];
    if (file) {
      // Ajustamos el mensaje según el tipo de dato de fisioterapia
      const categoria = tipo === 'asistencia' ? 'Citas/Asistencias' : 'Evaluaciones Biométricas';
      
      this.estadoGuardado = `Expediente de ${categoria} detectado: ${file.name}. Listo para procesar.`;
      
      // Guardamos en localStorage para que el fisio no pierda el hilo si se agota el tiempo
      localStorage.setItem('ultimo_paso_clinico', this.estadoGuardado);
      
      console.log(`Preparado para procesar datos de: ${file.name}`);
    }
  }
}
