import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-predicciones-especiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './predicciones-especiales.component.html',
})
export class PrediccionesEspecialesComponent implements OnInit {

  equipos = signal<any[]>([]);
  misPredicciones = signal<any[]>([]);
  cargando = signal<boolean>(true);
  tiposResueltos = signal<string[]>([]);
  resultadosGlobales = signal<any[]>([]);
  cerrado = signal<boolean>(false);
  pestanaActiva = signal<'equipos' | 'jugadores'>('equipos');
  mensajes: { [tipo: string]: string } = {};
  equiposSub21 = signal<any[]>([]);

  tiposEquipo = [
    { key: 'Ganador del mundial', label: '🏆 Ganador del mundial' },
    { key: 'Subcampeon', label: '🥈 Subcampeón' },
    { key: 'Seleccion decepcion', label: '😬 Selección decepción' },
    { key: 'Mejor anfitrion', label: '🏠 Mejor anfitrión' },
    { key: 'Equipo mas goleador', label: '🚪 Equipo más goleador' },
    { key: 'Equipo menos goleado', label: '🧱 Equipo menos goleado' },
    { key: 'Equipo sorpresa', label: '🔥 Equipo sorpresa' },
  ];

  tiposJugador = [
    { key: 'Goleador', label: '⚽ Goleador del mundial', soloPortero: false, soloSub21: false },
    { key: 'MVP del mundial', label: '⭐ MVP del mundial', soloPortero: false, soloSub21: false },
    { key: 'Mejor portero', label: '👟 Mejor portero', soloPortero: true, soloSub21: false },
    { key: 'Maximo asistente', label: '🎯 Máximo asistente', soloPortero: false, soloSub21: false },
    { key: 'Mejor jugador joven', label: '🌟 Mejor jugador joven sub-21', soloPortero: false, soloSub21: true }
  ];

  selecciones: { [tipo: string]: string } = {};
  equipoSeleccionado: { [tipo: string]: string } = {};
  jugadoresPorTipo: { [tipo: string]: any[] } = {};
  cargandoJugadores: { [tipo: string]: boolean } = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  isPrediccionResuelta(tipo: string): boolean {
    return this.tiposResueltos().includes(tipo);
  }

  getResultadoResuelto(tipo: string): any {
    return this.resultadosGlobales().find(r => r.tipo === tipo);
  }

cargarDatos(): void {
  forkJoin({
    equipos: this.http.get<any[]>(`${environment.apiUrl}/predicciones-especiales/equipos`, {
      headers: this.getHeaders()
    }),
    equiposSub21: this.http.get<any[]>(`${environment.apiUrl}/predicciones-especiales/equipos-con-sub21`, {
      headers: this.getHeaders()
    })
  }).subscribe({
    next: ({ equipos, equiposSub21 }: { equipos: any[], equiposSub21: any[] }) => {
      this.equipos.set(equipos);
      this.equiposSub21.set(equiposSub21);

      this.http.get<any[]>(`${environment.apiUrl}/partidos/fases`, {
        headers: this.getHeaders()
      }).subscribe({
        next: (fases) => {
          const jornada1 = fases.find(f => f.nombre === 'Jornada 1 Fase de Grupos');
          if (jornada1) {
            this.cerrado.set(new Date() > new Date(jornada1.fechaLimite));
          }
          this.http.get<any>(`${environment.apiUrl}/predicciones-especiales`, {
            headers: this.getHeaders()
          }).subscribe({
            next: (res) => {
              const predicciones: any[] = Array.isArray(res) ? res : (res.predicciones || []);
              const tiposResueltos: string[] = Array.isArray(res) ? [] : (res.tiposResueltos || []);
              this.misPredicciones.set(predicciones);
              this.tiposResueltos.set(tiposResueltos);
              predicciones.forEach((p: any) => {
                this.selecciones[p.tipo] = p.valorPredicho?._id || p.valorPredicho;
                if (p.tipoValor === 'Jugador' && p.valorPredicho?.equipo?._id) {
                  this.equipoSeleccionado[p.tipo] = p.valorPredicho.equipo._id;
                  const tipoConfig = this.tiposJugador.find(t => t.key === p.tipo);
                  if (!tipoConfig) return;
                  let url = `${environment.apiUrl}/predicciones-especiales/jugadores?equipoId=${p.valorPredicho.equipo._id}`;
                  if (tipoConfig.soloPortero) url += '&posicion=Portero';
                  if (tipoConfig.soloSub21) url += '&soloSub21=true';
                  this.http.get<any[]>(url, { headers: this.getHeaders() }).subscribe({
                    next: (jugadores) => {
                      this.jugadoresPorTipo[p.tipo] = jugadores;
                      this.cdr.detectChanges();
                    }
                  });
                }
              });
              this.http.get<any[]>(`${environment.apiUrl}/predicciones-especiales/resultados`, {
                headers: this.getHeaders()
              }).subscribe({
                next: (resultados) => {
                  this.resultadosGlobales.set(resultados);
                  this.cargando.set(false);
                  this.cdr.detectChanges();
                },
                error: () => this.cargando.set(false)
              });
            },
            error: () => this.cargando.set(false)
          });
        },
        error: () => this.cargando.set(false)
      });
    },
    error: () => this.cargando.set(false)
  });
}

  cargarJugadoresPorTipo(tipo: string): void {
    const equipoId = this.equipoSeleccionado[tipo];
    if (!equipoId) return;

    const tipoConfig = this.tiposJugador.find(t => t.key === tipo);
    if (!tipoConfig) return;

    this.cargandoJugadores[tipo] = true;

    let url = `${environment.apiUrl}/predicciones-especiales/jugadores?equipoId=${equipoId}`;
    if (tipoConfig.soloPortero) url += '&posicion=Portero';
    if (tipoConfig.soloSub21) url += '&soloSub21=true';

    this.http.get<any[]>(url, { headers: this.getHeaders() }).subscribe({
      next: (jugadores) => {
        this.jugadoresPorTipo[tipo] = jugadores;
        delete this.selecciones[tipo];
        this.cargandoJugadores[tipo] = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoJugadores[tipo] = false;
      }
    });
  }

  guardarPrediccion(tipo: string): void {
    if (this.cerrado()) return;

    const valorPredicho = this.selecciones[tipo];
    if (!valorPredicho) {
      this.mensajes[tipo] = '❌ Selecciona una opción';
      this.cdr.detectChanges();
      setTimeout(() => { this.mensajes[tipo] = ''; this.cdr.detectChanges(); }, 3000);
      return;
    }

    this.http.post(`${environment.apiUrl}/predicciones-especiales`, {
      tipo,
      valorPredicho
    }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensajes[tipo] = '✅ Guardado';

        const prediccionesActuales = this.misPredicciones();
        const index = prediccionesActuales.findIndex(p => p.tipo === tipo);
        if (index >= 0) {
          prediccionesActuales[index].valorPredicho = { _id: this.selecciones[tipo] };
          this.misPredicciones.set([...prediccionesActuales]);
        } else {
          this.misPredicciones.set([...prediccionesActuales, { tipo, valorPredicho: { _id: this.selecciones[tipo] } }]);
        }

        this.cdr.detectChanges();
        setTimeout(() => { this.mensajes[tipo] = ''; this.cdr.detectChanges(); }, 1000);
      },
      error: (err) => {
        this.mensajes[tipo] = '❌ ' + (err.error?.message || 'Error');
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajes[tipo] = ''; this.cdr.detectChanges(); }, 3000);
      }
    });
  }

  getEquiposPorTipo(tipo: string): any[] {
    if (tipo === 'Mejor anfitrion') {
      return this.equipos().filter(e =>
        ['Estados Unidos', 'México', 'Canadá'].includes(e.nombre)
      );
    }
    return this.equipos();
  }

  getJugadoresPorTipo(tipo: string): any[] {
    return this.jugadoresPorTipo[tipo] || [];
  }

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w40/${codigo}.png`;
  }

  getPrediccionActual(tipo: string): any {
    return this.misPredicciones().find(p => p.tipo === tipo);
  }
}