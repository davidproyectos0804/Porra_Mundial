import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  datos = { nombre: '', email: '', password: '', confirmarPassword: '' };
  error = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    if (!this.datos.nombre.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.datos.email);
    if (!emailValido) {
      this.error = 'El email no es válido';
      return;
    }

    if (!this.datos.password) {
      this.error = 'La contraseña es obligatoria';
      return;
    }

    if (this.datos.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

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
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}