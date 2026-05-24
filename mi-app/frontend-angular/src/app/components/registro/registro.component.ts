import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
  datos = { nombre: '', email: '', password: '', confirmarPassword: '' };
  error = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  
  ngOnInit(): void {
  google.accounts.id.initialize({
    client_id: '539168963154-u24hmnfhs8ref84r7obi3vrke9duf64u.apps.googleusercontent.com',
    callback: (response: any) => this.handleGoogleResponse(response)
  });

  // Esperar a que el DOM esté listo para leer el ancho real
  setTimeout(() => {
  const btn = document.getElementById('google-btn-registro'); // FIX: nombre correcto
  google.accounts.id.renderButton(btn, {
    theme: 'filled_black',
    size: 'large',
    width: btn!.offsetWidth,
    text: 'continue_with',
    shape: 'rectangular'
  });
}, 0);
}

  handleGoogleResponse(response: any): void {
    this.authService.googleLogin(response.credential).subscribe({
      next: (res) => {
        if (res.usuario.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/partidos']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error con Google';
        this.cdr.detectChanges();
      }
    });
  }

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