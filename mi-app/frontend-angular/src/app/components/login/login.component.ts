import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  datos = { email: '', password: '' };
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

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      {
        theme: 'filled_black',
        size: 'large',
        width: 350,
        text: 'signin_with',
        shape: 'rectangular'
      }
    );
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
    if (!this.datos.email.trim()) {
      this.error = 'El email es obligatorio';
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

    this.cargando = true;
    this.error = '';

    this.authService.login(this.datos).subscribe({
      next: (res) => {
        if (res.usuario.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/partidos']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}