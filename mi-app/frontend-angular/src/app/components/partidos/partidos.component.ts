import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PartidoService } from '../../services/partido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-partidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './partidos.component.html',
  styleUrl: './partidos.component.css'
})
export class PartidosComponent implements OnInit {

  fases = signal<any[]>([]);
  partidos = signal<any[]>([]);
  predicciones = signal<any[]>([]);
  faseActual = signal<any>(null);
  faseIndex = signal<number>(0);
  cargando = signal<boolean>(true);
  usuario: any;

  // Guardamos los inputs de predicción por partidoId
  inputsPrediccion: { [partidoId: string]: { local: number, visitante: number } } = {};
  mensajes: { [partidoId: string]: string } = {};

  constructor(
    private partidoService: PartidoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarFases();
  }

  cargarFases(): void {
    this.partidoService.getFases().subscribe({
      next: (fases) => {
        const fasesGrupos = fases.filter(f => f.nombre.includes('Fase de Grupos'));
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

        // Cargar predicciones existentes
        this.partidoService.getMisPredicciones(faseId).subscribe({
          next: (predicciones) => {
            this.predicciones.set(predicciones);

            // Rellenar inputs con predicciones existentes
            predicciones.forEach(p => {
              this.inputsPrediccion[p.partido] = {
                local: p.golesLocalPredicho,
                visitante: p.golesVisitantePredicho
              };
            });

            this.cargando.set(false);
          },
          error: () => this.cargando.set(false)
        });
      },
      error: () => this.cargando.set(false)
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

  getInputPrediccion(partidoId: string): { local: number, visitante: number } {
    if (!this.inputsPrediccion[partidoId]) {
      this.inputsPrediccion[partidoId] = { local: 0, visitante: 0 };
    }
    return this.inputsPrediccion[partidoId];
  }

  guardarPrediccion(partidoId: string): void {
    const input = this.inputsPrediccion[partidoId];
    if (input === undefined) return;

    this.partidoService.guardarPrediccion(partidoId, input.local, input.visitante).subscribe({
      next: () => {
        this.mensajes[partidoId] = '✅ Guardado';
        setTimeout(() => this.mensajes[partidoId] = '', 2000);
      },
      error: (err) => {
        this.mensajes[partidoId] = '❌ ' + (err.error?.message || 'Error');
        setTimeout(() => this.mensajes[partidoId] = '', 3000);
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}