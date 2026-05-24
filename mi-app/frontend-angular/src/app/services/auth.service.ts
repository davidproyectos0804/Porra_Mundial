import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  // Registro de usuario
  register(datos: { nombre: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, datos).pipe(
      tap((res: any) => this.guardarSesion(res))
    );
  }

  // Login de usuario
  login(datos: { email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, datos).pipe(
      tap((res: any) => this.guardarSesion(res))
    );
  }

  // Guardar token y usuario en localStorage
  private guardarSesion(res: any): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('usuario', JSON.stringify(res.usuario));
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener usuario actual
  getUsuario(): any {
  const usuario = localStorage.getItem('usuario');
  return usuario && usuario !== 'undefined' ? JSON.parse(usuario) : null;
}

  // Comprobar si está logueado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Comprobar si es admin
  isAdmin(): boolean {
    const usuario = this.getUsuario();
    return usuario?.rol === 'admin';
  }
  // Subir foto de perfil
subirFoto(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('foto', file);

  return this.http.post(`${environment.apiUrl}/usuario/foto`, formData, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    })
  }).pipe(
    tap((res: any) => {
      // Actualizar el usuario en localStorage con la nueva foto
      const usuario = this.getUsuario();
      if (usuario) {
        usuario.fotoPerfil = res.fotoPerfil;
        localStorage.setItem('usuario', JSON.stringify(usuario));
      }
    })
  );
}
cambiarNombre(nombre: string): Observable<any> {
  return this.http.put(`${environment.apiUrl}/usuario/nombre`, { nombre }, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    })
  }).pipe(
    tap((res: any) => {
      const usuario = this.getUsuario();
      if (usuario) {
        usuario.nombre = res.nombre;
        localStorage.setItem('usuario', JSON.stringify(usuario));
      }
    })
  );
}
}