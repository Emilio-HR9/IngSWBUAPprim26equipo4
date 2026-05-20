import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-modulo4-presentacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './modulo4-presentacion.html',
  styleUrl: './modulo4-presentacion.css',
})
export class Modulo4PresentacionComponent implements OnInit {
  botonHabilitado: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    // RF-EXEC-001: Seguridad de 5 segundos para que el usuario vea el video antes de comenzar
    setTimeout(() => {
      this.botonHabilitado = true;
      this.cdr.detectChanges();
    }, 5000);
  }

  comenzar() {
    if (this.botonHabilitado) {
      this.router.navigate(['/retroalimentacion']);
    }
  }
}
