import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit, OnDestroy {

  usuario: any;
  fotoPerfil = signal<string | null>(null);
  editandoNombre = signal<boolean>(false);
  nuevoNombre = signal<string>('');
  errorNombre = signal<string>('');
  menuAbierto = signal<boolean>(false);

  private subs = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscripción al usuario reactivo — se actualiza solo cuando cambian los datos
    this.subs.add(
      this.authService.usuario$.subscribe(usuario => {
        this.usuario = usuario;
        this.fotoPerfil.set(usuario?.fotoPerfil || null);
      })
    );

    // Refresca los puntos del backend cada vez que el usuario navega a una página
    this.subs.add(
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd)
      ).subscribe(() => {
        if (this.authService.isLoggedIn()) {
          this.authService.refreshUsuario();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  toggleMenu(): void {
    this.menuAbierto.set(!this.menuAbierto());
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
      next: (res) => this.fotoPerfil.set(res.fotoPerfil),
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
    if (!nombre) { this.errorNombre.set('El nombre no puede estar vacío'); return; }
    if (nombre.length < 3) { this.errorNombre.set('Mínimo 3 caracteres'); return; }
    if (nombre.length > 20) { this.errorNombre.set('Máximo 20 caracteres'); return; }

    this.authService.cambiarNombre(nombre).subscribe({
      next: () => {
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