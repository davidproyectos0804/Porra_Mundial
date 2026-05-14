import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  datos = { nombre: '', email: '', password: '', confirmarPassword: '' };
  error = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.datos.password !== this.datos.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.register({
      nombre: this.datos.nombre,
      email: this.datos.email,
      password: this.datos.password
    }).subscribe({
      next: (res) => {
        if (res.usuario.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/partidos']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse';
        this.cargando = false;
      }
    });
  }
}