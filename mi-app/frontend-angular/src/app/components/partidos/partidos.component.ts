import { Component, OnInit, OnDestroy, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PartidoService } from '../../services/partido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-partidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partidos.component.html'
})
export class PartidosComponent implements OnInit, OnDestroy {
  fases = signal<any[]>([]);
  partidos = signal<any[]>([]);
  predicciones = signal<any[]>([]);
  faseActual = signal<any>(null);
  faseIndex = signal<number>(0);
  cargando = signal<boolean>(true);
  tiempoRestante = signal<string>('');
  tiempoCierre = signal<string>('');
  private intervalo: any;
  private intervaloCierre: any;

  usuario: any;
  inputsPrediccion: { [partidoId: string]: { local: any, visitante: any } } = {};
  mensajes: { [partidoId: string]: string } = {};
  guardando: { [partidoId: string]: boolean } = {};

  constructor(
    private partidoService: PartidoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarFases();
    this.iniciarContador();
    this.iniciarContadorCierre();
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
    if (this.intervaloCierre) clearInterval(this.intervaloCierre);
  }

  iniciarContador(): void {
    const fechaInicio = new Date('2026-06-11T21:00:00');
    const calcular = () => {
      const ahora = new Date();
      const diff = fechaInicio.getTime() - ahora.getTime();
      if (diff <= 0) {
        this.tiempoRestante.set('');
        clearInterval(this.intervalo);
        return;
      }
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diff % (1000 * 60)) / 1000);
      this.tiempoRestante.set(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
    };
    calcular();
    this.intervalo = setInterval(calcular, 1000);
  }
  
  cargarFases(): void {
    this.partidoService.getFases().subscribe({
      next: (fases) => {
        this.fases.set(fases);
        if (fases.length > 0) {
          const indexActual = 3; // ← cambiar numero para indicar la fase actual
          this.faseIndex.set(indexActual);
          this.faseActual.set(fases[indexActual]);
          this.cargarPartidosYPredicciones(fases[indexActual]._id);
        }
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  cargarPartidosYPredicciones(faseId: string): void {
    this.cargando.set(true);
    this.inputsPrediccion = {};
    this.mensajes = {};
    this.guardando = {};

    this.partidoService.getPartidosPorFase(faseId).subscribe({
      next: (partidos) => {
        this.partidos.set(partidos);
        partidos.forEach(p => {
          this.inputsPrediccion[p._id] = { local: '', visitante: '' };
        });
        this.partidoService.getMisPredicciones(faseId).subscribe({
          next: (predicciones) => {
            this.predicciones.set(predicciones);
            predicciones.forEach(p => {
              this.inputsPrediccion[p.partido] = {
                local: p.golesLocalPredicho,
                visitante: p.golesVisitantePredicho
              };
            });
            this.cargando.set(false);
            this.iniciarContadorCierre();
          },
          error: () => {
            this.cargando.set(false);
            this.iniciarContadorCierre();
          }
        });
      },
      error: () => {
        this.cargando.set(false);
        this.iniciarContadorCierre();
      }
    });
  }

  jornadadAnterior(): void {
    const index = this.faseIndex();
    if (index > 0) {
      const nuevoIndex = index - 1;
      this.faseIndex.set(nuevoIndex);
      this.faseActual.set(this.fases()[nuevoIndex]);
      this.cargarPartidosYPredicciones(this.fases()[nuevoIndex]._id);
    }
  }

  jornadaSiguiente(): void {
    const index = this.faseIndex();
    if (index < this.fases().length - 1) {
      const nuevoIndex = index + 1;
      this.faseIndex.set(nuevoIndex);
      this.faseActual.set(this.fases()[nuevoIndex]);
      this.cargarPartidosYPredicciones(this.fases()[nuevoIndex]._id);
    }
  }

  guardarPrediccion(partidoId: string): void {
    const input = this.inputsPrediccion[partidoId];
    if (input === undefined) return;

    if (input.local === '' || input.visitante === '') {
      this.mensajes[partidoId] = '❌ Introduce ambos marcadores';
      this.cdr.detectChanges();
      setTimeout(() => { this.mensajes[partidoId] = ''; this.cdr.detectChanges(); }, 3000);
      return;
    }

   const localStr = String(input.local);
const visitanteStr = String(input.visitante);

// Solo números enteros
if (!/^\d+$/.test(localStr) || !/^\d+$/.test(visitanteStr)) {
  this.mensajes[partidoId] = '❌ Solo se permiten números';
  this.cdr.detectChanges();
  setTimeout(() => {
    this.mensajes[partidoId] = '';
    this.cdr.detectChanges();
  }, 3000);
  return;
}

// Ceros a la izquierda
if (
  /^0\d+$/.test(localStr) ||
  /^0\d+$/.test(visitanteStr)
) {
  this.mensajes[partidoId] = '❌ No se permiten ceros a la izquierda';
  this.cdr.detectChanges();
  setTimeout(() => {
    this.mensajes[partidoId] = '';
    this.cdr.detectChanges();
  }, 3000);
  return;
}

    const local = Number(input.local);
    const visitante = Number(input.visitante);

    if (local < 0 || visitante < 0) {
      this.mensajes[partidoId] = '❌ Los goles no pueden ser negativos';
      this.cdr.detectChanges();
      setTimeout(() => { this.mensajes[partidoId] = ''; this.cdr.detectChanges(); }, 3000);
      return;
    }

    if (local > 10 || visitante > 10) {
      this.mensajes[partidoId] = '❌ Máximo 10 goles por equipo';
      this.cdr.detectChanges();
      setTimeout(() => { this.mensajes[partidoId] = ''; this.cdr.detectChanges(); }, 3000);
      return;
    }

    if (!Number.isInteger(local) || !Number.isInteger(visitante)) {
      this.mensajes[partidoId] = '❌ Solo se permiten números enteros';
      this.cdr.detectChanges();
      setTimeout(() => { this.mensajes[partidoId] = ''; this.cdr.detectChanges(); }, 3000);
      return;
    }

    this.guardando[partidoId] = true;
    this.cdr.detectChanges();

    this.partidoService.guardarPrediccion(partidoId, local, visitante).subscribe({
      next: () => {
        const actuales = this.predicciones();
        const nuevas = actuales.filter(p => p.partido !== partidoId);
        this.predicciones.set([
          ...nuevas,
          {
            partido: partidoId,
            golesLocalPredicho: local,
            golesVisitantePredicho: visitante,
            puntosObtenidos: null
          }
        ]);
        this.guardando[partidoId] = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajes[partidoId] = ''; this.cdr.detectChanges(); }, 1000);
      },
      error: (err) => {
        this.guardando[partidoId] = false;
        this.mensajes[partidoId] = '❌ ' + (err.error?.message || 'Error');
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajes[partidoId] = ''; this.cdr.detectChanges(); }, 3000);
      }
    });
  }

  jornadaCerrada(): boolean {
    const fase = this.faseActual();
    if (!fase) return false;
    return new Date() > new Date(fase.fechaLimite);
  }

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w40/${codigo}.png`;
  }

  getPuntosPartido(partidoId: string): number | null {
    const prediccion = this.predicciones().find(p => p.partido === partidoId);
    return prediccion ? prediccion.puntosObtenidos : null;
  }

  yaPredicho(partidoId: string): boolean {
    return this.predicciones().some(p => p.partido === partidoId);
  }

  scrollArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
iniciarContadorCierre(): void {
  // 1. Limpia el intervalo anterior SIEMPRE
  if (this.intervaloCierre) {
    clearInterval(this.intervaloCierre);
    this.intervaloCierre = null;
  }

  // 2. Función que calcula y actualiza el signal
  const calcular = () => {
    const fase = this.faseActual();
    if (!fase) {
      this.tiempoCierre.set('');
      return;
    }

    const ahora = new Date().getTime();
    const limite = new Date(fase.fechaLimite).getTime();
    const diff = limite - ahora;

    if (diff <= 0) {
      this.tiempoCierre.set('Cerrada');
      // Si ya está cerrada, detenemos el intervalo para no gastar recursos
      if (this.intervaloCierre) {
        clearInterval(this.intervaloCierre);
        this.intervaloCierre = null;
      }
      return;
    }

    // Cálculo de tiempo restante
    const horasTotales = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

    let texto = '';
    if (horasTotales >= 24) {
      const dias = Math.floor(horasTotales / 24);
      const horasResto = horasTotales % 24;
      texto = `${dias}d ${horasResto}h ${minutos}m ${segundos}s`;
    } else {
      texto = `${horasTotales}h ${minutos}m ${segundos}s`;
    }

    this.tiempoCierre.set(texto);
  };

  // 3. Ejecuta el cálculo una vez y luego inicia el intervalo
  calcular();
  // Solo inicia el intervalo si la fecha no ha pasado
  const fase = this.faseActual();
  if (fase && new Date(fase.fechaLimite).getTime() > new Date().getTime()) {
    this.intervaloCierre = setInterval(calcular, 1000);
  }
}
  tiempoParaCierre(): string {
    const fase = this.faseActual();
    if (!fase) return '';
    const diff = new Date(fase.fechaLimite).getTime() - new Date().getTime();
    if (diff <= 0) return '';
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
    if (horas >= 24) {
      const dias = Math.floor(horas / 24);
      const horasResto = horas % 24;
      return `${dias}d ${horasResto}h ${minutos}m`;
    }
    return `${horas}h ${minutos}m ${segundos}s`;
  }

  claseTimerCierre(): string {
    const fase = this.faseActual();
    if (!fase) return '';
    const diff = new Date(fase.fechaLimite).getTime() - new Date().getTime();
    const horas = diff / (1000 * 60 * 60);
    if (horas < 6) return 'text-[#e63946] font-black animate-pulse';
    if (horas < 24) return 'text-yellow-400 font-black';
    return 'text-emerald-400 font-bold';
  }
}