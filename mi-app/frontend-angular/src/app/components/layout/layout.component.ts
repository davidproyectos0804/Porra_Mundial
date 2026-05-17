import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  usuario: any;
  fotoPerfil = signal<string | null>(null);
  editandoNombre = signal<boolean>(false);
  nuevoNombre = signal<string>('');
  errorNombre = signal<string>('');

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUsuario();
    this.fotoPerfil.set(this.usuario?.fotoPerfil || null);
  }

  abrirSelectorFoto(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) this.subirFoto(file);
    };
    input.click();
  }

  subirFoto(file: File): void {
    this.authService.subirFoto(file).subscribe({
      next: (res) => {
        this.fotoPerfil.set(res.fotoPerfil);
      },
      error: (err) => console.error('Error subiendo foto:', err)
    });
  }

  abrirEditarNombre(): void {
    this.nuevoNombre.set(this.usuario?.nombre || '');
    this.editandoNombre.set(true);
    this.errorNombre.set('');
  }

  guardarNombre(): void {
    const nombre = this.nuevoNombre().trim();

    if (!nombre) {
      this.errorNombre.set('El nombre no puede estar vacío');
      return;
    }
    if (nombre.length < 3) {
      this.errorNombre.set('Mínimo 3 caracteres');
      return;
    }
    if (nombre.length > 20) {
      this.errorNombre.set('Máximo 20 caracteres');
      return;
    }

    this.authService.cambiarNombre(nombre).subscribe({
      next: (res) => {
        this.usuario.nombre = res.nombre;
        this.editandoNombre.set(false);
        this.errorNombre.set('');
      },
      error: (err) => {
        this.errorNombre.set(err.error?.message || 'Error actualizando nombre');
      }
    });
  }

  cancelarNombre(): void {
    this.editandoNombre.set(false);
    this.errorNombre.set('');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}