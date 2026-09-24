import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';
import { CursoService } from '../../services/curso';
import { Curso } from '../../models/curso.model';
import { Navbar } from '../../components/navbar/navbar';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

// Cursos Component - Catálogo de cursos disponíveis com suporte a visitante
@Component({
  selector: 'app-cursos',
  imports: [NgFor, NgIf, Navbar, SafeUrlPipe],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})
export class Cursos implements OnInit {
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  cursoSelecionado: Curso | null = null;
  aulaSelecionadaId: number | string | null = null;
  isGuest = false;
  alertaVisitante = '';

  filtroCategoria = 'Todos';
  categorias: string[] = ['Todos'];

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
    this.cursosFiltrados = [...this.cursos];

    const cats = [...new Set(this.cursos.map(c => c.categoria))];
    this.categorias = ['Todos', ...cats];
  }

  filtrar(categoria: string) {
    this.filtroCategoria = categoria;
    this.cursosFiltrados = categoria === 'Todos'
      ? [...this.cursos]
      : this.cursos.filter(c => c.categoria === categoria);
    this.cursoSelecionado = null;
  }

  selecionarCurso(curso: Curso) {
    this.cursoSelecionado = curso;
    this.aulaSelecionadaId = null;
    this.alertaVisitante = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selecionarAula(aulaId: number | string) {
    this.aulaSelecionadaId = aulaId;
    this.alertaVisitante = '';
  }

  marcarAssistida(cursoId: number | string, aulaId: number | string) {
    if (this.isGuest) {
      this.alertaVisitante = 'Para salvar suas aulas concluídas no histórico e no perfil, crie sua conta gratuita ou faça login!';
      return;
    }
    this.cursoService.marcarAulaComoAssistida(cursoId, aulaId);
  }

  isAssistida(cursoId: number | string, aulaId: number | string): boolean {
    if (this.isGuest) return false;
    const prog = this.cursoService.getProgressoCurso(cursoId);
    return prog ? prog.aulasAssistidas.includes(aulaId) : false;
  }

  getProgresso(cursoId: number | string): number {
    if (this.isGuest) return 0;
    return this.cursoService.getProgressoCurso(cursoId)?.percentualConcluido || 0;
  }

  voltarParaCursos() {
    this.cursoSelecionado = null;
    this.aulaSelecionadaId = null;
    this.alertaVisitante = '';
  }

  getAulaAtual() {
    if (!this.cursoSelecionado || !this.aulaSelecionadaId) return null;
    return this.cursoSelecionado.aulas.find(a => a.id == this.aulaSelecionadaId) || null;
  }

  getBadgeClass(nivel: string): string {
    const map: Record<string, string> = {
      'Iniciante': 'bg-success',
      'Intermediário': 'bg-warning text-dark',
      'Avançado': 'bg-danger'
    };
    return map[nivel] || 'bg-secondary';
  }

  irParaLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
