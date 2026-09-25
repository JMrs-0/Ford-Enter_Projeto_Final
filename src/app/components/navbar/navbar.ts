import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/usuario.model';

// Navbar Component - Suporta usuário deslogado, visitante e autenticado
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isSidebarOpen = false;
  usuario: Usuario | null = null;
  isLoggedIn = false;
  isGuest = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.usuario = this.authService.getUsuarioAtual();
    this.isGuest = this.authService.isGuest();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.usuario = null;
    this.isGuest = false;
    this.router.navigate(['/home']);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
