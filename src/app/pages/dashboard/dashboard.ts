import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../services/auth';
import { CursoService } from '../../services/curso';
import { Curso, ProgressoUsuario } from '../../models/curso.model';
import { Navbar } from '../../components/navbar/navbar';

// Dashboard Component - baseado no dashboard.ts do repositório Ford-Enter_Angular
// Adaptado para exibir progresso de estudos e métricas com suporte ao modo visitante
@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgIf, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  cursos: Curso[] = [];
  progressoList: ProgressoUsuario[] = [];
  cursoCodigo = '';
  isGuest = false;

  // BehaviorSubject pattern do repositório Angular
  searchSubject = new Subject<string>();
  searchSubscription!: Subscription;
  progressoSubscription!: Subscription;

  totalAulasAssistidas = 0;
  totalCursos = 0;
  mediaConclusao = 0;
  cursosEmProgresso = 0;

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
    this.cursos = this.cursoService.getCursos();
    this.totalCursos = this.cursos.length;

    if (!this.isGuest) {
      // Reactive subscription - padrão do dashboard.ts do Angular repo
      this.progressoSubscription = this.cursoService.progresso$.subscribe(progresso => {
        this.progressoList = progresso;
        this.totalAulasAssistidas = this.cursoService.getTotalAulasAssistidas();
        this.cursosEmProgresso = progresso.filter(p => p.percentualConcluido > 0 && p.percentualConcluido < 100).length;
        this.mediaConclusao = progresso.length > 0
          ? Math.round(progresso.reduce((s, p) => s + p.percentualConcluido, 0) / this.totalCursos)
          : 0;
      });
    }

    // debounceTime e distinctUntilChanged - padrão RxJS do dashboard.ts
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(codigo => {
      this.cursoCodigo = codigo;
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
    if (this.progressoSubscription) this.progressoSubscription.unsubscribe();
  }

  getProgressoCurso(cursoId: number | string): number {
    return this.progressoList.find(p => p.cursoId == cursoId)?.percentualConcluido || 0;
  }

  getAulasAssistidas(cursoId: number | string): number {
    return this.progressoList.find(p => p.cursoId == cursoId)?.aulasAssistidas.length || 0;
  }

  irParaLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
