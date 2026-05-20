import { Routes } from '@angular/router';
import { Modulo4PresentacionComponent } from './componentes/modulo4-presentacion/modulo4-presentacion';
import { RetroalimentacionComponent } from './componentes/retroalimentacion/retroalimentacion';

export const routes: Routes = [

    {path: '', component: Modulo4PresentacionComponent},
    {path: 'retroalimentacion', component: RetroalimentacionComponent}
];
