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
  faseIndex = signal<number>(0);
  pestanaActiva = signal<'partidos' | 'especiales'>('partidos');

  inputsResultado: { [partidoId: string]: { local: number, visitante: number } } = {};
  mensajes: { [partidoId: string]: string } = {};
  guardando: { [partidoId: string]: boolean } = {};
  borrando: { [partidoId: string]: boolean } = {};

  // Formulario de creación de partido
  nuevoPartido = { equipoLocal: '', equipoVisitante: '', fecha: '', hora: '' };
  creandoPartido = signal<boolean>(false);
  mensajeNuevoPartido = signal<string>('');

  // Señales para las predicciones especiales
  resolviendo = signal<{ [tipo: string]: boolean }>({});
  resueltosYa = signal<{ [tipo: string]: boolean }>({});
  resultadosEspeciales = signal<{ [tipo: string]: any }>({});
  mensajesEspeciales = signal<{ [tipo: string]: string }>({});
  seleccionesResolucion = signal<{ [tipo: string]: string }>({});
  equipoSeleccionadoResolucion = signal<{ [tipo: string]: string }>({});
  jugadoresPorTipoResolucion = signal<{ [tipo: string]: any[] }>({});
  cargandoJugadoresResolucion = signal<{ [tipo: string]: boolean }>({});
  cargandoResultados = signal<boolean>(true);

  tiposPrediccion = [
    { key: 'Ganador del mundial', label: '🏆 Ganador del mundial' },
    { key: 'Subcampeon', label: '🥈 Subcampeón' },
    { key: 'Seleccion decepcion', label: '😬 Selección decepción' },
    { key: 'Mejor anfitrion', label: '🏠 Mejor anfitrión' },
    { key: 'Equipo mas goleador', label: '🚪 Equipo más goleador' },
    { key: 'Equipo menos goleado', label: '🧱 Equipo menos goleado' },
    { key: 'Equipo sorpresa', label: '🔥 Equipo sorpresa' },
  ];

  tiposPrediccionJugador = [
    { key: 'Goleador', label: '⚽ Goleador del mundial', soloPortero: false, soloSub21: false },
    { key: 'MVP del mundial', label: '⭐ MVP del mundial', soloPortero: false, soloSub21: false },
    { key: 'Mejor portero', label: '👟 Mejor portero', soloPortero: true, soloSub21: false },
    { key: 'Maximo asistente', label: '🎯 Máximo asistente', soloPortero: false, soloSub21: false },
    { key: 'Mejor jugador joven', label: '🌟 Mejor jugador joven sub-21', soloPortero: false, soloSub21: true }
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFases();
    this.cargarEquipos();
    this.cargarResultadosEspeciales();
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
        const ahora = new Date().getTime();
        let indexInicial = 0;

        // Busca la última fase cuya fechaLimite ya ha pasado
        for (let i = fases.length - 1; i >= 0; i--) {
          if (new Date(fases[i].fechaLimite).getTime() < ahora) {
            indexInicial = i;
            break;
          }
        }

        this.faseIndex.set(indexInicial);
        this.faseActual.set(fases[indexInicial]);
        this.cargarPartidos(fases[indexInicial]._id);
      }
    },
    error: () => this.router.navigate(['/partidos'])
  });
}
faseEstaCerrada(): boolean {
  const fase = this.faseActual();
  if (!fase) return false;
  return new Date() > new Date(fase.fechaLimite);
}

  cargarEquipos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/predicciones-especiales/equipos`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (equipos) => this.equipos.set(equipos)
    });
  }

  cargarResultadosEspeciales(): void {
    this.cargandoResultados.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/predicciones-especiales/resultados`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (resultados) => {
        const resueltos: { [tipo: string]: boolean } = {};
        const resultadosObj: { [tipo: string]: any } = {};
        resultados.forEach(r => {
          resultadosObj[r.tipo] = r.valorCorrecto;
          resueltos[r.tipo] = true;
        });
        this.resultadosEspeciales.set(resultadosObj);
        this.resueltosYa.set(resueltos);
        this.cargandoResultados.set(false);
      },
      error: () => this.cargandoResultados.set(false)
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
    this.faseIndex.set(this.fases().indexOf(fase));
  }

  cargarJugadoresResolucion(tipo: string): void {
    const equipoId = this.equipoSeleccionadoResolucion()[tipo];
    if (!equipoId) return;

    const tipoConfig = this.tiposPrediccionJugador.find(t => t.key === tipo);
    if (!tipoConfig) return;

    // Actualizar estado de carga
    this.cargandoJugadoresResolucion.update(v => ({ ...v, [tipo]: true }));
    // Limpiar selección previa
    this.seleccionesResolucion.update(v => {
      const nuevo = { ...v };
      delete nuevo[tipo];
      return nuevo;
    });

    let url = `${environment.apiUrl}/predicciones-especiales/jugadores?equipoId=${equipoId}`;
    if (tipoConfig.soloPortero) url += '&posicion=Portero';
    if (tipoConfig.soloSub21) url += '&soloSub21=true';

    this.http.get<any[]>(url, { headers: this.getHeaders() }).subscribe({
      next: (jugadores) => {
        this.jugadoresPorTipoResolucion.update(v => ({ ...v, [tipo]: jugadores }));
        this.cargandoJugadoresResolucion.update(v => ({ ...v, [tipo]: false }));
      },
      error: () => {
        this.cargandoJugadoresResolucion.update(v => ({ ...v, [tipo]: false }));
      }
    });
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
    this.guardando[partidoId] = true;
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
      },
      complete: () => {
        this.guardando[partidoId] = false;
      }
    });
  }

crearPartido(): void {
  const { equipoLocal, equipoVisitante, fecha, hora } = this.nuevoPartido;

  const fase = this.faseActual();
  if (!fase) return;

  if (new Date() > new Date(fase.fechaLimite)) {
    this.mensajeNuevoPartido.set('❌ No se pueden añadir partidos a una fase cerrada');
    setTimeout(() => this.mensajeNuevoPartido.set(''), 3000);
    return;
  }

  if (!equipoLocal || !equipoVisitante || !fecha || !hora) {
    this.mensajeNuevoPartido.set('❌ Rellena todos los campos');
    setTimeout(() => this.mensajeNuevoPartido.set(''), 3000);
    return;
  }

  if (equipoLocal === equipoVisitante) {
    this.mensajeNuevoPartido.set('❌ Los equipos no pueden ser iguales');
    setTimeout(() => this.mensajeNuevoPartido.set(''), 3000);
    return;
  }

  const fechaHora = new Date(`${fecha}T${hora}:00`);

  this.creandoPartido.set(true);

  this.http.post(`${environment.apiUrl}/admin/partidos`, {
    fase: fase._id,
    equipoLocal,
    equipoVisitante,
    fechaHora
  }, { headers: this.getHeaders() }).subscribe({
    next: () => {
      this.mensajeNuevoPartido.set('✅ Partido creado');
      this.nuevoPartido = { equipoLocal: '', equipoVisitante: '', fecha: '', hora: '' };
      this.cargarPartidos(fase._id);
      this.creandoPartido.set(false);
      setTimeout(() => this.mensajeNuevoPartido.set(''), 3000);
    },
    error: (err) => {
      this.mensajeNuevoPartido.set('❌ ' + (err.error?.message || 'Error'));
      this.creandoPartido.set(false);
      setTimeout(() => this.mensajeNuevoPartido.set(''), 3000);
    }
  });
}

  borrarPartido(partidoId: string): void {
    const confirmado = confirm('¿Seguro que quieres borrar este partido? Esta acción no se puede deshacer.');
    if (!confirmado) return;

    this.borrando[partidoId] = true;

    this.http.delete(`${environment.apiUrl}/admin/partidos/${partidoId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.partidos.set(this.partidos().filter(p => p._id !== partidoId));
      },
      error: (err) => {
        this.mensajes[partidoId] = '❌ ' + (err.error?.message || 'Error borrando');
        setTimeout(() => this.mensajes[partidoId] = '', 3000);
      },
      complete: () => {
        this.borrando[partidoId] = false;
      }
    });
  }

  resolverEspecial(tipo: string): void {
    const valorCorrecto = this.seleccionesResolucion()[tipo];
    if (!valorCorrecto) {
      this.mensajesEspeciales.update(v => ({ ...v, [tipo]: '❌ Selecciona el valor correcto' }));
      setTimeout(() => this.mensajesEspeciales.update(v => ({ ...v, [tipo]: '' })), 3000);
      return;
    }

    // Activar estado "resolviendo"
    this.resolviendo.update(v => ({ ...v, [tipo]: true }));

    this.http.put(`${environment.apiUrl}/predicciones-especiales/resolver`, {
      tipo,
      valorCorrecto
    }, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        this.mensajesEspeciales.update(v => ({ ...v, [tipo]: `✅ ${res.message}` }));
        this.resolviendo.update(v => ({ ...v, [tipo]: false }));
        this.resueltosYa.update(v => ({ ...v, [tipo]: true }));

        // Buscar el objeto completo para mostrarlo como resultado
        const equipoEncontrado = this.equipos().find(e => e._id === valorCorrecto);
        if (equipoEncontrado) {
          this.resultadosEspeciales.update(v => ({ ...v, [tipo]: equipoEncontrado }));
        } else {
          const jugadores = this.jugadoresPorTipoResolucion()[tipo] || [];
          const jugadorEncontrado = jugadores.find(j => j._id === valorCorrecto);
          if (jugadorEncontrado) {
            this.resultadosEspeciales.update(v => ({ ...v, [tipo]: jugadorEncontrado }));
          }
        }

        setTimeout(() => this.mensajesEspeciales.update(v => ({ ...v, [tipo]: '' })), 4000);
      },
      error: (err) => {
        this.mensajesEspeciales.update(v => ({ ...v, [tipo]: '❌ ' + (err.error?.message || 'Error') }));
        this.resolviendo.update(v => ({ ...v, [tipo]: false }));
        setTimeout(() => this.mensajesEspeciales.update(v => ({ ...v, [tipo]: '' })), 3000);
      }
    });
  }

  actualizarSeleccionResolucion(tipo: string, valor: string): void {
    this.seleccionesResolucion.update(v => ({ ...v, [tipo]: valor }));
  }

  actualizarEquipoSeleccionadoResolucion(tipo: string, equipoId: string): void {
    this.equipoSeleccionadoResolucion.update(v => ({ ...v, [tipo]: equipoId }));
    this.cargarJugadoresResolucion(tipo);
  }

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w40/${codigo}.png`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cambiarFaseAnterior(): void {
    const i = this.faseIndex();
    if (i > 0) {
      this.faseIndex.set(i - 1);
      this.cambiarFase(this.fases()[i - 1]);
    }
  }

  cambiarFaseSiguiente(): void {
    const i = this.faseIndex();
    if (i < this.fases().length - 1) {
      this.faseIndex.set(i + 1);
      this.cambiarFase(this.fases()[i + 1]);
    }
  }
}