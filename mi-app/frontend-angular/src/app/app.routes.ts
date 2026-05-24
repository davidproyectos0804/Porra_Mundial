import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'partidos', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent) },
  { path: 'verificar', loadComponent: () => import('./components/verificar/verificar.component').then(m => m.VerificarComponent) },
  { path: 'verificar-email', loadComponent: () => import('./components/verificar-email/verificar-email.component').then(m => m.VerificarEmailComponent) },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'partidos', loadComponent: () => import('./components/partidos/partidos.component').then(m => m.PartidosComponent) },
      { path: 'ranking', loadComponent: () => import('./components/ranking/ranking.component').then(m => m.RankingComponent) },
      { path: 'predicciones-especiales', loadComponent: () => import('./components/predicciones-especiales/predicciones-especiales.component').then(m => m.PrediccionesEspecialesComponent) },
      { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent), canActivate: [adminGuard] },
    ]
  },
  { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },
];