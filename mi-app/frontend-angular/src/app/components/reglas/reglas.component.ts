import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reglas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reglas.component.html',
})
export class ReglasComponent implements OnInit {

  prediccionesEspeciales = [
    { nombre: '🏆 Ganador del mundial' },
    { nombre: '🥈 Subcampeón' },
    { nombre: '😬 Selección decepción' },
    { nombre: '🏠 Mejor anfitrión' },
    { nombre: '🚪 Equipo más goleador' },
    { nombre: '🧱 Equipo menos goleado' },
    { nombre: '🔥 Equipo sorpresa' },
    { nombre: '⚽ Goleador del mundial' },
    { nombre: '⭐ MVP del mundial' },
    { nombre: '👟 Mejor portero' },
    { nombre: '🎯 Máximo asistente' },
    { nombre: '🌟 Mejor jugador joven sub-21' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.marcarReglasComoVistas();
  }
}