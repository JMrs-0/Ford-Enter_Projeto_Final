import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';
import { CursoService } from '../../services/curso';
import { Navbar } from '../../components/navbar/navbar';

// AulasAssistidas Component - rastreamento de progresso com suporte ao modo visitante
@Component({
  selector: 'app-aulas-assistidas',
  imports: [NgFor, NgIf, Navbar],
  templateUrl: './aulas-assistidas.html',
  styleUrl: './aulas-assistidas.css'
})
export class AulasAssistidas implements OnInit, OnDestroy {
  aulasAssistidas: { aula: any, curso: any }[] = [];
  isGuest = false;
  private subscription!: Subscription;

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

    if (!this.isGuest) {
      this.subscription = this.cursoService.progresso$.subscribe(() => {
        this.aulasAssistidas = this.cursoService.getAulasAssistidas();
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  getTotalMinutos(): number {
    return this.aulasAssistidas.length * 45;
  }

  irParaLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irParaCursos() {
    this.router.navigate(['/cursos']);
  }
}
