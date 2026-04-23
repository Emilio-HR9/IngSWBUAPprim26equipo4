import { Component } from '@angular/core';
import * as confetti from 'canvas-confetti';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retroalimentacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retroalimentacion.html',
  styleUrls: ['./retroalimentacion.css'],
})

export class RetroalimentacionComponent {

  repActual = 0;
  repTotal = 10;

  puntos = 0;
  racha = 0;

  mensajeActual = '';

  mensajes = [
    "¡Excelente!",
    "¡Muy bien!",
    "¡Sigue así!",
    "¡Gran trabajo!",
    "¡Impresionante!"
  ];

  constructor(private router: Router){}

  registrarRepeticion(){

    if(this.repActual < this.repTotal){

      this.repActual++;

      this.puntos += 10;

      this.mostrarMensaje();

      if(this.repActual === this.repTotal){
        this.completarEjercicio();
      }

    }

  }

  mostrarMensaje(){

    let random = Math.floor(Math.random() * this.mensajes.length);

    this.mensajeActual = this.mensajes[random];

    setTimeout(()=>{
      this.mensajeActual = '';
    },1500);

  }

completarEjercicio(){
  this.puntos += 50;
  this.racha++;
  this.lanzarConfetti();
}

  lanzarConfetti(){
  confetti.default({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
  }

  volver(){
    this.router.navigate(['/']);
  }
}



