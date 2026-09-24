import { Injectable } from '@angular/core';
import { Curso, Aula, Playlist, ProgressoUsuario } from '../models/curso.model';
import { BehaviorSubject } from 'rxjs';

// Serviço de cursos e progresso - plataforma de estudos de programação
@Injectable({
  providedIn: 'root'
})
export class CursoService {

  // Dados simulados dos cursos disponíveis - conteúdo gratuito
  private cursos: Curso[] = [
    {
      id: 1,
      titulo: 'HTML e CSS',
      descricao: 'Aprenda os fundamentos de HTML e CSS, criando páginas web responsivas com boas práticas de estruturação e estilização.',
      categoria: 'Front-end',
      nivel: 'Iniciante',
      totalAulas: 6,
      cargaHoraria: '4h 30min',
      img: 'img/html-css.png',
      aulas: [
        { id: 1, titulo: 'Introdução ao HTML', descricao: 'Estrutura básica de uma página HTML, tags essenciais e semântica.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/epDCjksKMok', assistida: false, progresso: 0 },
        { id: 2, titulo: 'Elementos e Tags', descricao: 'Listas, tabelas, formulários e elementos HTML.', duracao: '40:00', urlVideo: 'https://www.youtube.com/embed/3oSIqIqzN3M', assistida: false, progresso: 0 },
        { id: 3, titulo: 'CSS Fundamentos', descricao: 'Seletores, propriedades, Box Model e cascata.', duracao: '50:00', urlVideo: 'https://www.youtube.com/embed/wRNinF7YQqQ', assistida: false, progresso: 0 },
        { id: 4, titulo: 'Flexbox', descricao: 'Layout com Flexbox: alinhamento e distribuição de elementos.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/s9gR1Mvt9Po', assistida: false, progresso: 0 },
        { id: 5, titulo: 'CSS Grid', descricao: 'Criação de layouts complexos com CSS Grid.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/EFafSYg-PkI', assistida: false, progresso: 0 },
        { id: 6, titulo: 'Responsividade e Media Queries', descricao: 'Técnicas de design responsivo para diferentes dispositivos.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/H91DhKPjhPk', assistida: false, progresso: 0 }
      ]
    },
    {
      id: 2,
      titulo: 'JavaScript',
      descricao: 'Domine o JavaScript do básico ao avançado, incluindo DOM, eventos, Promises, classes e muito mais.',
      categoria: 'Front-end',
      nivel: 'Iniciante',
      totalAulas: 7,
      cargaHoraria: '5h 15min',
      img: 'img/javascript.png',
      aulas: [
        { id: 7, titulo: 'Introdução ao JavaScript', descricao: 'Variáveis, tipos de dados e operadores.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/BXqUH86F-kA', assistida: false, progresso: 0 },
        { id: 8, titulo: 'Estruturas de Controle', descricao: 'If/else, switch, loops for e while.', duracao: '40:00', urlVideo: 'https://www.youtube.com/embed/FdePtO5JSd0', assistida: false, progresso: 0 },
        { id: 9, titulo: 'Funções e Escopos', descricao: 'Funções, arrow functions, closures e escopo.', duracao: '50:00', urlVideo: 'https://www.youtube.com/embed/mc3TKp2XzhI', assistida: false, progresso: 0 },
        { id: 10, titulo: 'Arrays e Objetos', descricao: 'Manipulação de arrays e objetos, métodos úteis.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/v2ifWcnQs6M', assistida: false, progresso: 0 },
        { id: 11, titulo: 'DOM e Eventos', descricao: 'Manipulação do DOM e criação de interações com eventos.', duracao: '55:00', urlVideo: 'https://www.youtube.com/embed/UftSB4DaRU4', assistida: false, progresso: 0 },
        { id: 12, titulo: 'Classes e POO', descricao: 'Programação orientada a objetos com classes JavaScript.', duracao: '50:00', urlVideo: 'https://www.youtube.com/embed/i6Oi-YtXnAU', assistida: false, progresso: 0 },
        { id: 13, titulo: 'Promises e Async/Await', descricao: 'Programação assíncrona com Promises e async/await.', duracao: '50:00', urlVideo: 'https://www.youtube.com/embed/1O3iIdDLCaA', assistida: false, progresso: 0 }
      ]
    },
    {
      id: 3,
      titulo: 'LGPD para Desenvolvedores',
      descricao: 'Entenda a Lei Geral de Proteção de Dados (LGPD) e como aplicá-la em seus projetos de software.',
      categoria: 'Compliance',
      nivel: 'Intermediário',
      totalAulas: 5,
      cargaHoraria: '3h 20min',
      img: 'img/lgpd.png',
      aulas: [
        { id: 14, titulo: 'O que é a LGPD?', descricao: 'Contexto, objetivos e princípios da Lei Geral de Proteção de Dados.', duracao: '40:00', urlVideo: 'https://www.youtube.com/embed/3XYVXBLh9NY', assistida: false, progresso: 0 },
        { id: 15, titulo: 'Dados Pessoais e Sensíveis', descricao: 'Categorias de dados, bases legais e consentimento.', duracao: '40:00', urlVideo: 'https://www.youtube.com/embed/wl6a2bLVmCI', assistida: false, progresso: 0 },
        { id: 16, titulo: 'Direitos dos Titulares', descricao: 'Direitos dos usuários e como implementá-los no sistema.', duracao: '40:00', urlVideo: 'https://www.youtube.com/embed/kkk2_sSsaKE', assistida: false, progresso: 0 },
        { id: 17, titulo: 'Segurança de Dados', descricao: 'Boas práticas de segurança para proteção de dados pessoais.', duracao: '40:00', urlVideo: 'https://www.youtube.com/embed/rnmcRTnTVo4', assistida: false, progresso: 0 },
        { id: 18, titulo: 'LGPD na Prática', descricao: 'Implementando conformidade com LGPD em aplicações reais.', duracao: '40:00', urlVideo: 'https://www.youtube.com/embed/oOV3ZYwUU5w', assistida: false, progresso: 0 }
      ]
    },
    {
      id: 4,
      titulo: 'Angular',
      descricao: 'Construa aplicações web modernas com o framework Angular. Aprenda componentes, serviços, rotas, guards e RxJS.',
      categoria: 'Front-end',
      nivel: 'Avançado',
      totalAulas: 8,
      cargaHoraria: '6h 40min',
      img: 'img/angular.png',
      aulas: [
        { id: 19, titulo: 'Introdução ao Angular', descricao: 'Estrutura do projeto, módulos, standalone components.', duracao: '50:00', urlVideo: 'https://www.youtube.com/embed/f7BJFTEbc10', assistida: false, progresso: 0 },
        { id: 20, titulo: 'Componentes e Templates', descricao: 'Criação de componentes, data binding e diretivas.', duracao: '55:00', urlVideo: 'https://www.youtube.com/embed/3qBXWUpoPHo', assistida: false, progresso: 0 },
        { id: 21, titulo: 'Serviços e Injeção de Dependência', descricao: 'Services, @Injectable e injeção de dependências.', duracao: '50:00', urlVideo: 'https://www.youtube.com/embed/G0bBLvWXBvc', assistida: false, progresso: 0 },
        { id: 22, titulo: 'Roteamento com Angular Router', descricao: 'Configuração de rotas, navegação e parâmetros de rota.', duracao: '50:00', urlVideo: 'https://www.youtube.com/embed/Nehk4tBxD4o', assistida: false, progresso: 0 },
        { id: 23, titulo: 'Guards de Autenticação', descricao: 'Proteção de rotas com CanActivate guards.', duracao: '40:00', urlVideo: 'https://www.youtube.com/embed/bX4JMuVuJWo', assistida: false, progresso: 0 },
        { id: 24, titulo: 'Formulários e Validação', descricao: 'Template-driven forms e Reactive forms.', duracao: '55:00', urlVideo: 'https://www.youtube.com/embed/8dn7J1Rk_7k', assistida: false, progresso: 0 },
        { id: 25, titulo: 'RxJS e Observables', descricao: 'Programação reativa com RxJS, BehaviorSubject e operadores.', duracao: '55:00', urlVideo: 'https://www.youtube.com/embed/T9wOu11uU6U', assistida: false, progresso: 0 },
        { id: 26, titulo: 'HTTP Client e APIs', descricao: 'Comunicação com APIs REST usando HttpClient.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/8dn7J1Rk_7k', assistida: false, progresso: 0 }
      ]
    },
    {
      id: 5,
      titulo: 'Lógica de Programação',
      descricao: 'Fundamentos de lógica de programação, algoritmos e estruturas de dados para iniciantes.',
      categoria: 'Fundamentos',
      nivel: 'Iniciante',
      totalAulas: 5,
      cargaHoraria: '3h 45min',
      img: 'img/logica.png',
      aulas: [
        { id: 27, titulo: 'Algoritmos e Fluxogramas', descricao: 'Conceitos básicos de algoritmos e representação gráfica.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/8mei6uVttho', assistida: false, progresso: 0 },
        { id: 28, titulo: 'Variáveis e Tipos de Dados', descricao: 'Declaração de variáveis e tipos primitivos.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/Jb2cE1QcI5Y', assistida: false, progresso: 0 },
        { id: 29, titulo: 'Estruturas Condicionais', descricao: 'If/else, switch e expressões lógicas.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/kDr23RUgFMA', assistida: false, progresso: 0 },
        { id: 30, titulo: 'Laços de Repetição', descricao: 'For, while e do-while na prática.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/pzNOJJGONUE', assistida: false, progresso: 0 },
        { id: 31, titulo: 'Funções e Modularização', descricao: 'Criação de funções e organização do código.', duracao: '45:00', urlVideo: 'https://www.youtube.com/embed/XS1Yp7bTPnU', assistida: false, progresso: 0 }
      ]
    },
    {
      id: 6,
      titulo: 'Git e Versionamento',
      descricao: 'Controle de versão com Git e GitHub. Aprenda desde os primeiros commits até fluxos colaborativos com branches.',
      categoria: 'Ferramentas',
      nivel: 'Iniciante',
      totalAulas: 5,
      cargaHoraria: '3h 00min',
      img: 'img/git.png',
      aulas: [
        { id: 32, titulo: 'Introdução ao Git', descricao: 'O que é controle de versão e como funciona o Git.', duracao: '36:00', urlVideo: 'https://www.youtube.com/embed/UBAX-13g8OM', assistida: false, progresso: 0 },
        { id: 33, titulo: 'Primeiros Comandos', descricao: 'init, add, commit, status e log na prática.', duracao: '36:00', urlVideo: 'https://www.youtube.com/embed/OuOb1_qADBQ', assistida: false, progresso: 0 },
        { id: 34, titulo: 'Branches e Merges', descricao: 'Criação de branches, merge e resolução de conflitos.', duracao: '36:00', urlVideo: 'https://www.youtube.com/embed/FyLzAqoJdao', assistida: false, progresso: 0 },
        { id: 35, titulo: 'GitHub na Prática', descricao: 'Push, pull, fork e pull requests no GitHub.', duracao: '36:00', urlVideo: 'https://www.youtube.com/embed/UbJLOn1leiU', assistida: false, progresso: 0 },
        { id: 36, titulo: 'Metodologias Ágeis e Git Flow', descricao: 'Scrum, Kanban e fluxo de trabalho com Git Flow.', duracao: '36:00', urlVideo: 'https://www.youtube.com/embed/394mc6PV8t8', assistida: false, progresso: 0 }
      ]
    }
  ];

  // BehaviorSubject para progresso reativo - padrão RxJS do projeto Angular
  private progressoSubject = new BehaviorSubject<ProgressoUsuario[]>(this.carregarProgresso());

  progresso$ = this.progressoSubject.asObservable();

  constructor() { }

  getCursos(): Curso[] {
    return this.cursos;
  }

  getCursoPorId(id: number | string): Curso | undefined {
    return this.cursos.find(c => c.id == id);
  }

  getCursosPorCategoria(categoria: string): Curso[] {
    return this.cursos.filter(c => c.categoria === categoria);
  }

  marcarAulaComoAssistida(cursoId: number | string, aulaId: number | string): void {
    const progresso = this.progressoSubject.getValue();
    let cursoProg = progresso.find(p => p.cursoId == cursoId);
    const curso = this.getCursoPorId(cursoId);

    if (!cursoProg) {
      cursoProg = { cursoId, aulasAssistidas: [], percentualConcluido: 0 };
      progresso.push(cursoProg);
    }

    if (!cursoProg.aulasAssistidas.includes(aulaId)) {
      cursoProg.aulasAssistidas.push(aulaId);
    }

    if (curso) {
      cursoProg.percentualConcluido = Math.round((cursoProg.aulasAssistidas.length / curso.totalAulas) * 100);
    }

    this.salvarProgresso(progresso);
    this.progressoSubject.next([...progresso]);
  }

  getProgressoCurso(cursoId: number | string): ProgressoUsuario | undefined {
    return this.progressoSubject.getValue().find(p => p.cursoId == cursoId);
  }

  getTotalAulasAssistidas(): number {
    return this.progressoSubject.getValue().reduce((total, p) => total + p.aulasAssistidas.length, 0);
  }

  getAulasAssistidas(): { aula: Aula, curso: Curso }[] {
    const resultado: { aula: Aula, curso: Curso }[] = [];
    const progresso = this.progressoSubject.getValue();

    for (const prog of progresso) {
      const curso = this.getCursoPorId(prog.cursoId);
      if (curso) {
        for (const aulaId of prog.aulasAssistidas) {
          const aula = curso.aulas.find(a => a.id == aulaId);
          if (aula) resultado.push({ aula, curso });
        }
      }
    }

    return resultado;
  }

  private carregarProgresso(): ProgressoUsuario[] {
    const data = localStorage.getItem('progresso_cursos');
    return data ? JSON.parse(data) : [];
  }

  private salvarProgresso(progresso: ProgressoUsuario[]): void {
    localStorage.setItem('progresso_cursos', JSON.stringify(progresso));
  }
}
