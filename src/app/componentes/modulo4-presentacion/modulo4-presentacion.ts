import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-modulo4-presentacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './modulo4-presentacion.html',
  styleUrl: './modulo4-presentacion.css',
})
export class Modulo4PresentacionComponent implements OnInit, AfterViewInit {
  botonHabilitado: boolean = false;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

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

  ngAfterViewInit() {
    this.playVideo();
  }

  playVideo() {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      video.muted = true; // Asegura que esté silenciado programáticamente para cumplir con políticas de autoplay
      video.play().catch(error => {
        console.log("El autoplay automático fue bloqueado por el navegador o está esperando interacción:", error);
      });
    }
  }

  comenzar() {
    if (this.botonHabilitado) {
      this.router.navigate(['/retroalimentacion']);
    }
  }
}
