import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

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
  cerrado = signal<boolean>(false);
  pestanaActiva = signal<'equipos' | 'jugadores'>('equipos');
  mensajes: { [tipo: string]: string } = {};

  tiposJugador = [
  { key: 'Goleador', label: '⚽ Goleador del mundial' },
  { key: 'MVP del mundial', label: '⭐ MVP del mundial' },
  { key: 'Mejor portero', label: '👟 Mejor portero' },
  { key: 'Maximo asistente', label: '🎯 Máximo asistente' },
  { key: 'Mejor jugador joven', label: '🌟 Mejor jugador joven sub-21' },
];

  jugadores = signal<any[]>([]);

  tiposEquipo = [
    { key: 'Ganador del mundial', label: '🏆 Ganador del mundial' },
    { key: 'Subcampeon', label: '🥈 Subcampeón' },
    { key: 'Seleccion decepcion', label: '😬 Selección decepción' },
    { key: 'Mejor anfitrion', label: '🏠 Mejor anfitrión' },
    { key: 'Equipo mas goleador', label: '🚪 Equipo más goleador' },
    { key: 'Equipo menos goleado', label: '🧱 Equipo menos goleado' },
    { key: 'Equipo sorpresa', label: '🔥 Equipo sorpresa' },
  ];

  selecciones: { [tipo: string]: string } = {};

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

  cargarDatos(): void {
    // Cargar equipos
    this.http.get<any[]>(`${environment.apiUrl}/predicciones-especiales/equipos`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (equipos) => {
        this.equipos.set(equipos);

        // Comprobar si está cerrado usando la fechaLimite de Jornada 1
        this.http.get<any[]>(`${environment.apiUrl}/partidos/fases`, {
          headers: this.getHeaders()
        }).subscribe({
          next: (fases) => {
            const jornada1 = fases.find(f => f.nombre === 'Jornada 1 Fase de Grupos');
            if (jornada1) {
              this.cerrado.set(new Date() > new Date(jornada1.fechaLimite));
            }

            // Cargar mis predicciones
            this.http.get<any[]>(`${environment.apiUrl}/predicciones-especiales`, {
              headers: this.getHeaders()
            }).subscribe({
              next: (predicciones) => {
                this.misPredicciones.set(predicciones);
                predicciones.forEach(p => {
                  this.selecciones[p.tipo] = p.valorPredicho?._id || p.valorPredicho;
                });
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
  }

  guardarPrediccion(tipo: string): void {
    if (this.cerrado()) return;

    const valorPredicho = this.selecciones[tipo];
    if (!valorPredicho) {
      this.mensajes[tipo] = '❌ Selecciona un equipo';
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
  
  // Actualizar misPredicciones para que se vea PREDICHO sin recargar
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

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w40/${codigo}.png`;
  }

  getPrediccionActual(tipo: string): any {
    return this.misPredicciones().find(p => p.tipo === tipo);
  }
}