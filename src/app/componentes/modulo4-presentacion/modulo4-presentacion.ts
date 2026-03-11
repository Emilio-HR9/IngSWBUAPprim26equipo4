import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Agrega esta línea

@Component({
  selector: 'app-modulo4-presentacion',
  standalone: true, // Asegúrate de que esto diga true
  imports: [CommonModule], // <-- Agrégalo aquí también
  templateUrl: './modulo4-presentacion.html',
  styleUrl: './modulo4-presentacion.css'
})
export class Modulo4PresentacionComponent implements OnInit {
  botonHabilitado: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // RF-EXEC-001: Seguridad de 5 segundos
    setTimeout(() => {
      this.botonHabilitado = true;
      this.cdr.detectChanges();
    }, 5000);
  }
}