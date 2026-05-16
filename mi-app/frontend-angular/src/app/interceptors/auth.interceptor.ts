import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Rutas públicas que no necesitan token
  const rutasPublicas = ['/auth/register', '/auth/login', '/auth/verificar'];
  const esPublica = rutasPublicas.some(ruta => req.url.includes(ruta));

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !esPublica) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};