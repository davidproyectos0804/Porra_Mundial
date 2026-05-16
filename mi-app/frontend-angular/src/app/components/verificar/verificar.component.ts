import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verificar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verificar.component.html',
  styleUrl: './verificar.component.css'
})
export class VerificarComponent implements OnInit {

  estado = signal<'cargando' | 'exito' | 'error'>('cargando');
  mensaje = signal<string>('Verificando tu cuenta...');

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.estado.set('error');
      this.mensaje.set('Token de verificación no encontrado');
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/auth/verificar?token=${token}`).subscribe({
      next: (res) => {
        this.estado.set('exito');
        this.mensaje.set(res.message);
      },
      error: (err) => {
        this.estado.set('error');
        this.mensaje.set(err.error?.message || 'Error verificando cuenta');
      }
    });
  }
}