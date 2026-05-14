import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  fases = signal<any[]>([]);
  partidos = signal<any[]>([]);
  faseActual = signal<any>(null);
  cargando = signal<boolean>(true);

  // Inputs de resultados por partidoId
  inputsResultado: { [partidoId: string]: { local: number, visitante: number } } = {};
  mensajes: { [partidoId: string]: string } = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFases();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  cargarFases(): void {
    this.http.get<any[]>(`${environment.apiUrl}/admin/fases`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (fases) => {
        this.fases.set(fases);
        if (fases.length > 0) {
          this.faseActual.set(fases[0]);
          this.cargarPartidos(fases[0]._id);
        }
      },
      error: () => this.router.navigate(['/partidos'])
    });
  }

  cargarPartidos(faseId: string): void {
    this.cargando.set(true);
    this.inputsResultado = {};
    this.mensajes = {};

    this.http.get<any[]>(`${environment.apiUrl}/admin/partidos/fase/${faseId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (partidos) => {
        this.partidos.set(partidos);
        partidos.forEach(p => {
          this.inputsResultado[p._id] = {
            local: p.golesLocal ?? 0,
            visitante: p.golesVisitante ?? 0
          };
        });
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  cambiarFase(fase: any): void {
    this.faseActual.set(fase);
    this.cargarPartidos(fase._id);
  }

  meterResultado(partidoId: string): void {
    const input = this.inputsResultado[partidoId];

    this.http.put(`${environment.apiUrl}/admin/partidos/${partidoId}/resultado`, {
      golesLocal: input.local,
      golesVisitante: input.visitante
    }, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        this.mensajes[partidoId] = `✅ ${res.message}`;
        // Actualizar partido como finalizado
        const partidos = this.partidos();
        const index = partidos.findIndex(p => p._id === partidoId);
        if (index !== -1) {
          partidos[index].finalizado = true;
          partidos[index].golesLocal = input.local;
          partidos[index].golesVisitante = input.visitante;
          this.partidos.set([...partidos]);
        }
        setTimeout(() => this.mensajes[partidoId] = '', 3000);
      },
      error: (err) => {
        this.mensajes[partidoId] = '❌ ' + (err.error?.message || 'Error');
        setTimeout(() => this.mensajes[partidoId] = '', 3000);
      }
    });
  }

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w320/${codigo}.png`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}