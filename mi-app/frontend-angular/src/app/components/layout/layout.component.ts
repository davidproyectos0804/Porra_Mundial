import { Component } from '@angular/core';
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

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUsuario();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}