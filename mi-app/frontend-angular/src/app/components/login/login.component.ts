import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  datos = { email: '', password: '' };
  error = '';
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {}

 onSubmit() {
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
    }
  });
}
}