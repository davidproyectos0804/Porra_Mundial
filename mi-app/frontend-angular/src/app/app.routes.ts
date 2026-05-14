import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent) },
  { path: 'partidos', loadComponent: () => import('./components/partidos/partidos.component').then(m => m.PartidosComponent), canActivate: [authGuard] },
  { path: 'ranking', loadComponent: () => import('./components/ranking/ranking.component').then(m => m.RankingComponent), canActivate: [authGuard] },
];