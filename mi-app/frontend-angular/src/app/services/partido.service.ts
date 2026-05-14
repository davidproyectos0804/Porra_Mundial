import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Obtener todas las fases
  getFases(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/partidos/fases`, {
      headers: this.getHeaders()
    });
  }

  // Obtener partidos de una fase
  getPartidosPorFase(faseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/partidos/fase/${faseId}`, {
      headers: this.getHeaders()
    });
  }
  // Guardar predicción
guardarPrediccion(partidoId: string, golesLocal: number, golesVisitante: number): Observable<any> {
  return this.http.post(`${environment.apiUrl}/predicciones`, {
    partidoId,
    golesLocalPredicho: golesLocal,
    golesVisitantePredicho: golesVisitante
  }, { headers: this.getHeaders() });
}

// Obtener mis predicciones de una fase
getMisPredicciones(faseId: string): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiUrl}/predicciones/fase/${faseId}`, {
    headers: this.getHeaders()
  });
}
}