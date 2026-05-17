import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  usuario: any;
  fotoPerfil = signal<string | null>(null);

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
      error: (err) => {
        console.error('Error subiendo foto:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}