import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/usuario.model';

// Navbar Component - baseado no topbar/sidebar do projeto Angular Ford Enter
// Atualizado com suporte ao Modo Visitante e navegação dinâmica
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isSidebarOpen = false;
  usuario: Usuario | null = null;
  isGuest = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuarioAtual();
    this.isGuest = this.authService.isGuest();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irParaLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
