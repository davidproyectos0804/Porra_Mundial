import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { PartidoService } from '../../services/partido.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html'
})
export class RankingComponent implements OnInit {
  ranking = signal<any[]>([]);
  cargando = signal<boolean>(true);
  total = signal<number>(0);
  usuario: any;
  miPosicion = signal<any>(null);

  modalUsuario = signal<any>(null);
  prediccionesModal = signal<any[]>([]);
  cargandoModal = signal<boolean>(false);

  prediccionesEspecialesModal = signal<any[]>([]);
  cargandoEspecialesModal = signal<boolean>(false);

  pestanaModal = signal<'predicciones' | 'especiales'>('predicciones');

  faseModalIndex = signal<number>(0);
  fasesReales = signal<any[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private partidoService: PartidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarRanking();
    this.cargarFasesReales();
  }

  cargarFasesReales(): void {
  this.partidoService.getFases().subscribe({
    next: (fases) => {
      // Comprobar cuáles tienen partidos
      const checks = fases.map(f =>
        this.partidoService.getPartidosPorFase(f._id).toPromise().then(partidos => ({
          fase: f,
          tienePartidos: (partidos?.length || 0) > 0
        }))
      );
      Promise.all(checks).then(resultados => {
        const fasesConPartidos = resultados.filter(r => r.tienePartidos).map(r => r.fase);
        this.fasesReales.set(fasesConPartidos);
      });
    },
    error: () => {}
  });
}

  cargarRanking(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    this.http.get<any>(`${environment.apiUrl}/ranking`, { headers }).subscribe({
      next: (data) => {
        this.ranking.set(data.ranking);
        this.total.set(data.total);
        const index = data.ranking.findIndex((u: any) => u._id === this.usuario?._id);
        if (index >= 0) {
          this.miPosicion.set({ ...data.ranking[index], posicion: index + 1 });
        }
        this.cargando.set(false);
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  verPredicciones(usuario: any): void {
  this.modalUsuario.set(usuario);

this.prediccionesModal.set([]);
this.prediccionesEspecialesModal.set([]);

this.cargandoModal.set(true);
this.cargandoEspecialesModal.set(true);

this.pestanaModal.set('predicciones');  
  this.faseModalIndex.set(4); // ← cambiar número a mano para indicar la fase actual

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });
  this.http.get<any[]>(`${environment.apiUrl}/predicciones/usuario/${usuario._id}`, { headers }).subscribe({
    next: (predicciones) => {
      this.prediccionesModal.set(predicciones);
      this.cargandoModal.set(false);
    },
    error: () => this.cargandoModal.set(false)
  });
 this.http.get<any[]>(
  `${environment.apiUrl}/predicciones-especiales/usuario/${usuario._id}`,
  { headers }
).subscribe({
  next: (data) => {
    console.log('Especiales:', data);
    this.prediccionesEspecialesModal.set(data);
    this.cargandoEspecialesModal.set(false);
  },
  error: (err) => {
    console.error('Error especiales:', err);
    this.cargandoEspecialesModal.set(false);
  }
});
}

 cerrarModal(): void {
  this.modalUsuario.set(null);
  this.prediccionesModal.set([]);
  this.prediccionesEspecialesModal.set([]);

  this.faseModalIndex.set(0);
  this.pestanaModal.set('predicciones');
}

  getFasesModal(): any[] {
    return this.fasesReales();
  }

  faseModalActual(): any {
    return this.fasesReales()[this.faseModalIndex()] || null;
  }

  faseSiguienteModal(): void {
    if (this.faseModalIndex() < this.fasesReales().length - 1) {
      this.faseModalIndex.set(this.faseModalIndex() + 1);
    }
  }

  faseAnteriorModal(): void {
    if (this.faseModalIndex() > 0) {
      this.faseModalIndex.set(this.faseModalIndex() - 1);
    }
  }

  getPrediccionesPorFase(fase: any): any[] {
    if (!fase) return [];
    return this.prediccionesModal().filter(p => p.partido?.fase?.nombre === fase.nombre);
  }

  getFotoPerfil(usuario: any): string | null {
    return usuario?.fotoPerfil || null;
  }

  getBanderaUrl(codigo: string): string {
    return `https://flagcdn.com/w40/${codigo}.png`;
  }

  getResumenModal(): { aciertos: number, resultados: number, fallos: number, pendientes: number } {
    const predicciones = this.prediccionesModal();
    return {
      aciertos: predicciones.filter(p => p.puntosObtenidos === 500).length,
      resultados: predicciones.filter(p => p.puntosObtenidos === 200).length,
      fallos: predicciones.filter(p => p.puntosObtenidos === 0).length,
      pendientes: predicciones.filter(p => p.puntosObtenidos === null).length
    };
  }
  cambiarPestana(pestana: 'predicciones' | 'especiales'): void {
  this.pestanaModal.set(pestana);
}

esEquipo(p: any): boolean {
  return p.tipoValor === 'Equipo';
}

esJugador(p: any): boolean {
  return p.tipoValor === 'Jugador';
}
}