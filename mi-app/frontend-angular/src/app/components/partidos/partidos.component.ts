import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
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
export class PartidosComponent implements OnInit {

  fases = signal<any[]>([]);
  partidos = signal<any[]>([]);
  predicciones = signal<any[]>([]);
  faseActual = signal<any>(null);
  faseIndex = signal<number>(0);
  cargando = signal<boolean>(true);

  usuario: any;

  window = window;

  // Inputs por partido
  inputsPrediccion: {
    [partidoId: string]: {
      local: number,
      visitante: number
    }
  } = {};

  mensajes: { [partidoId: string]: string } = {};

  constructor(
    private partidoService: PartidoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarFases();
  }

  cargarFases(): void {
    this.partidoService.getFases().subscribe({
      next: (fases) => {

        const fasesGrupos = fases.filter(f =>
          f.nombre.includes('Fase de Grupos')
        );

        this.fases.set(fasesGrupos);

        if (fasesGrupos.length > 0) {
          this.faseActual.set(fasesGrupos[0]);
          this.cargarPartidosYPredicciones(fasesGrupos[0]._id);
        }
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  cargarPartidosYPredicciones(faseId: string): void {

    this.cargando.set(true);

    this.inputsPrediccion = {};
    this.mensajes = {};

    this.partidoService.getPartidosPorFase(faseId).subscribe({

      next: (partidos) => {

        this.partidos.set(partidos);

        partidos.forEach(p => {
          this.inputsPrediccion[p._id] = {
            local: 0,
            visitante: 0
          };
        });

        // cargar predicciones
        this.partidoService.getMisPredicciones(faseId).subscribe({

          next: (predicciones) => {

            this.predicciones.set(predicciones);

            // rellenar inputs
            predicciones.forEach(p => {

              this.inputsPrediccion[p.partido] = {
                local: p.golesLocalPredicho,
                visitante: p.golesVisitantePredicho
              };

            });

            this.cargando.set(false);
          },

          error: () => {
            this.cargando.set(false);
          }

        });

      },

      error: () => {
        this.cargando.set(false);
      }

    });

  }

  jornadadAnterior(): void {

    const index = this.faseIndex();

    if (index > 0) {

      const nuevoIndex = index - 1;

      this.faseIndex.set(nuevoIndex);
      this.faseActual.set(this.fases()[nuevoIndex]);

      this.cargarPartidosYPredicciones(
        this.fases()[nuevoIndex]._id
      );

    }

  }

  jornadaSiguiente(): void {

    const index = this.faseIndex();

    if (index < this.fases().length - 1) {

      const nuevoIndex = index + 1;

      this.faseIndex.set(nuevoIndex);
      this.faseActual.set(this.fases()[nuevoIndex]);

      this.cargarPartidosYPredicciones(
        this.fases()[nuevoIndex]._id
      );

    }

  }

  guardarPrediccion(partidoId: string): void {

    const input = this.inputsPrediccion[partidoId];

    if (input === undefined) return;

    const local = Number(input.local);
    const visitante = Number(input.visitante);

    // Validaciones
    if (isNaN(local) || isNaN(visitante)) {

      this.mensajes[partidoId] =
        '❌ Solo se permiten números';

      this.cdr.detectChanges();

      setTimeout(() => {
        this.mensajes[partidoId] = '';
        this.cdr.detectChanges();
      }, 3000);

      return;
    }

    if (local < 0 || visitante < 0) {

      this.mensajes[partidoId] =
        '❌ Los goles no pueden ser negativos';

      this.cdr.detectChanges();

      setTimeout(() => {
        this.mensajes[partidoId] = '';
        this.cdr.detectChanges();
      }, 3000);

      return;
    }

    if (!Number.isInteger(local) || !Number.isInteger(visitante)) {

      this.mensajes[partidoId] =
        '❌ Solo se permiten números enteros';

      this.cdr.detectChanges();

      setTimeout(() => {
        this.mensajes[partidoId] = '';
        this.cdr.detectChanges();
      }, 3000);

      return;
    }

    this.partidoService
      .guardarPrediccion(partidoId, local, visitante)
      .subscribe({

        next: () => {

          // 🔥 actualizar signal instantáneamente
          const actuales = this.predicciones();

          const nuevas = actuales.filter(
            p => p.partido !== partidoId
          );

          this.predicciones.set([
            ...nuevas,
            {
              partido: partidoId,
              golesLocalPredicho: local,
              golesVisitantePredicho: visitante,
              puntosObtenidos: null
            }
          ]);

          this.mensajes[partidoId] = '✅ Guardado';

          this.cdr.detectChanges();

          setTimeout(() => {

            this.mensajes[partidoId] = '';

            this.cdr.detectChanges();

          }, 1000);

        },

        error: (err) => {

          this.mensajes[partidoId] =
            '❌ ' + (err.error?.message || 'Error');

          this.cdr.detectChanges();

          setTimeout(() => {

            this.mensajes[partidoId] = '';

            this.cdr.detectChanges();

          }, 3000);

        }

      });

  }

  jornandaCerrada(): boolean {

    const fase = this.faseActual();

    if (!fase) return false;

    return new Date() > new Date(fase.fechaLimite);

  }

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w40/${codigo}.png`;
  }

  getPuntosPartido(partidoId: string): number | null {

    const prediccion = this.predicciones()
      .find(p => p.partido === partidoId);

    return prediccion
      ? prediccion.puntosObtenidos
      : null;

  }

  yaPredicho(partidoId: string): boolean {

    return this.predicciones()
      .some(p => p.partido === partidoId);

  }
  scrollArriba(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}