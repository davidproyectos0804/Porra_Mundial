import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  fases = signal<any[]>([]);
  partidos = signal<any[]>([]);
  faseActual = signal<any>(null);
  cargando = signal<boolean>(true);
  equipos = signal<any[]>([]);
  pestanaActiva = signal<'partidos' | 'especiales'>('partidos');

  inputsResultado: { [partidoId: string]: { local: number, visitante: number } } = {};
  mensajes: { [partidoId: string]: string } = {};
  resolviendo: { [tipo: string]: boolean } = {};
  resueltosYa: { [tipo: string]: boolean } = {};

  tiposPrediccion = [
    { key: 'Ganador del mundial', label: '🏆 Ganador del mundial' },
    { key: 'Subcampeon', label: '🥈 Subcampeón' },
    { key: 'Seleccion decepcion', label: '😬 Selección decepción' },
    { key: 'Mejor anfitrion', label: '🏠 Mejor anfitrión' },
    { key: 'Equipo mas goleador', label: '🚪 Equipo más goleador' },
    { key: 'Equipo menos goleado', label: '🧱 Equipo menos goleado' },
    { key: 'Equipo sorpresa', label: '🔥 Equipo sorpresa' },
  ];

  seleccionesResolucion: { [tipo: string]: string } = {};
  mensajesEspeciales: { [tipo: string]: string } = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFases();
    this.cargarEquipos();
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

  cargarEquipos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/predicciones-especiales/equipos`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (equipos) => this.equipos.set(equipos)
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

    if (input.local < 0 || input.visitante < 0) {
      this.mensajes[partidoId] = '❌ Los goles no pueden ser negativos';
      setTimeout(() => this.mensajes[partidoId] = '', 3000);
      return;
    }

    if (input.local === null || input.visitante === null) {
      this.mensajes[partidoId] = '❌ Introduce el resultado completo';
      setTimeout(() => this.mensajes[partidoId] = '', 3000);
      return;
    }

    this.http.put(`${environment.apiUrl}/admin/partidos/${partidoId}/resultado`, {
      golesLocal: input.local,
      golesVisitante: input.visitante
    }, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        this.mensajes[partidoId] = `✅ ${res.message}`;
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

  resolverEspecial(tipo: string): void {
    const valorCorrecto = this.seleccionesResolucion[tipo];
    if (!valorCorrecto) {
      this.mensajesEspeciales[tipo] = '❌ Selecciona el valor correcto';
      setTimeout(() => this.mensajesEspeciales[tipo] = '', 3000);
      return;
    }

    this.resolviendo[tipo] = true;

    this.http.put(`${environment.apiUrl}/predicciones-especiales/resolver`, {
      tipo,
      valorCorrecto
    }, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        this.mensajesEspeciales[tipo] = `✅ ${res.message}`;
        this.resolviendo[tipo] = false;
        this.resueltosYa[tipo] = true;
        setTimeout(() => this.mensajesEspeciales[tipo] = '', 4000);
      },
      error: (err) => {
        this.mensajesEspeciales[tipo] = '❌ ' + (err.error?.message || 'Error');
        this.resolviendo[tipo] = false;
        setTimeout(() => this.mensajesEspeciales[tipo] = '', 3000);
      }
    });
  }

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w40/${codigo}.png`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}