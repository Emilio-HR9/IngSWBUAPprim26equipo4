// Cambia 'App' por 'AppComponent' que es el nombre real de tu clase
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // Asegúrate de que apunte a './app/app'
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));