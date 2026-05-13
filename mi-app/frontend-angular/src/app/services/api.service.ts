import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz que define la forma de un usuario
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root' // Disponible en toda la app
})
export class ApiService {

  constructor(private http: HttpClient) {}

    getHello(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${environment.apiUrl}/hello`);
    }

    getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }
}