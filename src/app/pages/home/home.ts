import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CursoService } from '../../services/curso';
import { Navbar } from '../../components/navbar/navbar';

// Home Component - Página inicial pública da plataforma
@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf, RouterLink, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  totalCursos = 0;
  totalAulasAssistidas = 0;
  cursosDestaque: any[] = [];
  isLoggedIn = false;
  isGuest = false;

  constructor(
    private authService: AuthService,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isGuest = this.authService.isGuest();

    const cursos = this.cursoService.getCursos();
    this.totalCursos = cursos.length;
    this.totalAulasAssistidas = (this.isLoggedIn && !this.isGuest)
      ? this.cursoService.getTotalAulasAssistidas()
      : 0;
    this.cursosDestaque = cursos.slice(0, 3);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
