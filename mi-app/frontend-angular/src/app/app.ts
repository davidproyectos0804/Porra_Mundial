import { Component, OnInit, signal } from '@angular/core';
import { ApiService, User } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // Signals para guardar los datos del backend
  message = signal<string>('Cargando...');
  users = signal<User[]>([]);
  error = signal<string>('');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Llamada a /api/hello
    this.apiService.getHello().subscribe({
      next: (res) => this.message.set(res.message),
      error: () => this.error.set('Error conectando con el backend')
    });

    // Llamada a /api/users
    this.apiService.getUsers().subscribe({
      next: (res) => this.users.set(res),
      error: () => this.error.set('Error cargando usuarios')
    });
  }
}