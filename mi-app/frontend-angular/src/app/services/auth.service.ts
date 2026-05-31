import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // BehaviorSubject que emite el usuario cada vez que cambia
  private usuarioSubject = new BehaviorSubject<any>(this.getUsuario());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(datos: { nombre: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, datos).pipe(
      tap((res: any) => this.guardarSesion(res))
    );
  }

  login(datos: { email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, datos).pipe(
      tap((res: any) => this.guardarSesion(res))
    );
  }

  private guardarSesion(res: any): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('usuario', JSON.stringify(res.usuario));
    this.usuarioSubject.next(res.usuario);
  }

  // Actualiza el usuario desde el backend y sincroniza todo
  refreshUsuario(): void {
    this.http.get(`${environment.apiUrl}/usuario/perfil`, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` })
    }).subscribe({
      next: (usuario: any) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.usuarioSubject.next(usuario);
      },
      error: () => {}
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario && usuario !== 'undefined' ? JSON.parse(usuario) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUsuario()?.rol === 'admin';
  }

  subirFoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post(`${environment.apiUrl}/usuario/foto`, formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` })
    }).pipe(
      tap((res: any) => {
        const usuario = this.getUsuario();
        if (usuario) {
          usuario.fotoPerfil = res.fotoPerfil;
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.usuarioSubject.next({ ...usuario });
        }
      })
    );
  }

  cambiarNombre(nombre: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/usuario/nombre`, { nombre }, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` })
    }).pipe(
      tap((res: any) => {
        const usuario = this.getUsuario();
        if (usuario) {
          usuario.nombre = res.nombre;
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.usuarioSubject.next({ ...usuario });
        }
      })
    );
  }
  googleLogin(credential: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/google`, { credential }).pipe(
      tap((res: any) => this.guardarSesion(res))
    );
  }
  esPrimeraVez(): boolean {
    return !localStorage.getItem('yaVioReglas');
  }

  marcarReglasComoVistas(): void {
    localStorage.setItem('yaVioReglas', 'true');
  }
}
