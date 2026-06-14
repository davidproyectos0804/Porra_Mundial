import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
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
  faseModalIndex = signal<number>(0);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarRanking();
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
    this.cargandoModal.set(true);
    this.faseModalIndex.set(0);

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
  }

  cerrarModal(): void {
    this.modalUsuario.set(null);
    this.prediccionesModal.set([]);
    this.faseModalIndex.set(0);
  }

  getFasesModal(): string[] {
    const fases = this.prediccionesModal()
      .filter(p => p.partido?.fase)
      .map(p => p.partido.fase.nombre);
    return [...new Set<string>(fases)];
  }

  faseModalActual(): string {
    return this.getFasesModal()[this.faseModalIndex()] || '';
  }

  faseSiguienteModal(): void {
    if (this.faseModalIndex() < this.getFasesModal().length - 1) {
      this.faseModalIndex.set(this.faseModalIndex() + 1);
    }
  }

  faseAnteriorModal(): void {
    if (this.faseModalIndex() > 0) {
      this.faseModalIndex.set(this.faseModalIndex() - 1);
    }
  }

  getPrediccionesPorFase(fase: string): any[] {
    return this.prediccionesModal().filter(p => p.partido?.fase?.nombre === fase);
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
}