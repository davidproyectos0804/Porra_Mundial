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
  usuario: any;
  miPosicion = signal<any>(null);

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

    this.http.get<any[]>(`${environment.apiUrl}/ranking`, { headers }).subscribe({
      next: (data) => {
        this.ranking.set(data);
        const index = data.findIndex(u => u._id === this.usuario?.id);
        if (index >= 0) {
          this.miPosicion.set({ ...data[index], posicion: index + 1 });
        }
        this.cargando.set(false);
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  getFotoPerfil(usuario: any): string | null {
    return usuario?.fotoPerfil || null;
  }
}