import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PartidoService } from '../../services/partido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-partidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partidos.component.html',
  styleUrl: './partidos.component.css'
})
export class PartidosComponent implements OnInit {

  fases = signal<any[]>([]);
  partidos = signal<any[]>([]);
  faseActual = signal<any>(null);
  faseIndex = signal<number>(0);
  cargando = signal<boolean>(true);
  usuario: any;

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
        // Solo fases de grupos por ahora
        const fasesGrupos = fases.filter(f => f.nombre.includes('Fase de Grupos'));
        this.fases.set(fasesGrupos);
        if (fasesGrupos.length > 0) {
          this.faseActual.set(fasesGrupos[0]);
          this.cargarPartidos(fasesGrupos[0]._id);
        }
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  cargarPartidos(faseId: string): void {
    this.cargando.set(true);
    this.partidoService.getPartidosPorFase(faseId).subscribe({
      next: (partidos) => {
        this.partidos.set(partidos);
        this.cargando.set(false);
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
      this.cargarPartidos(this.fases()[nuevoIndex]._id);
    }
  }

  jornadaSiguiente(): void {
    const index = this.faseIndex();
    if (index < this.fases().length - 1) {
      const nuevoIndex = index + 1;
      this.faseIndex.set(nuevoIndex);
      this.faseActual.set(this.fases()[nuevoIndex]);
      this.cargarPartidos(this.fases()[nuevoIndex]._id);
    }
  }

  // Agrupar partidos por grupo
  getGrupos(): string[] {
    const grupos = new Set<string>();
    this.partidos().forEach(p => {
      if (p.equipoLocal?.grupo) grupos.add(p.equipoLocal.grupo);
    });
    return Array.from(grupos);
  }

  getPartidosPorGrupo(grupoId: string): any[] {
    return this.partidos().filter(p => p.equipoLocal?.grupo === grupoId);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w40/${codigo}.png`;
  }
}