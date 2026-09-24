import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CursoService } from '../../services/curso';
import { Navbar } from '../../components/navbar/navbar';

// Home Component - baseado no home.ts do Ford-Enter_Angular
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
  isGuest = false;

  constructor(
    private authService: AuthService,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isGuest = this.authService.isGuest();
    const cursos = this.cursoService.getCursos();
    this.totalCursos = cursos.length;
    this.totalAulasAssistidas = this.authService.isGuest() ? 0 : this.cursoService.getTotalAulasAssistidas();
    this.cursosDestaque = cursos.slice(0, 3);
  }

  irParaLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
