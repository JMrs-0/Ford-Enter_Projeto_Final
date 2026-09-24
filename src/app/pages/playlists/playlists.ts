import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CursoService } from '../../services/curso';
import { PlaylistService } from '../../services/playlist';
import { Playlist, Curso } from '../../models/curso.model';
import { Navbar } from '../../components/navbar/navbar';

// Playlists Component - criação e gerência de playlists de estudo com restrição para visitante
@Component({
  selector: 'app-playlists',
  imports: [NgFor, NgIf, FormsModule, Navbar],
  templateUrl: './playlists.html',
  styleUrl: './playlists.css'
})
export class Playlists implements OnInit {
  playlists: Playlist[] = [];
  cursos: Curso[] = [];
  isGuest = false;

  // Formulário de criação - padrão de two-way binding do Angular repo
  novoNome = '';
  novaDescricao = '';
  cursosSelecionados: (number | string)[] = [];
  errorMessage = '';
  mostrarFormulario = false;
  playlistEdicaoId: number | string | null = null;

  constructor(
    private authService: AuthService,
    private cursoService: CursoService,
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isGuest = this.authService.isGuest();

    if (!this.isGuest) {
      this.playlists = this.playlistService.getPlaylists();
      this.cursos = this.cursoService.getCursos();
    }
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) this.limparFormulario();
  }

  toggleCurso(cursoId: number | string) {
    const index = this.cursosSelecionados.indexOf(cursoId);
    if (index === -1) {
      this.cursosSelecionados.push(cursoId);
    } else {
      this.cursosSelecionados.splice(index, 1);
    }
  }

  isCursoSelecionado(cursoId: number | string): boolean {
    return this.cursosSelecionados.includes(cursoId);
  }

  salvarPlaylist() {
    this.errorMessage = '';
    if (!this.novoNome) {
      this.errorMessage = 'Informe um nome para a playlist.';
      return;
    }
    if (this.cursosSelecionados.length === 0) {
      this.errorMessage = 'Selecione ao menos um curso.';
      return;
    }

    if (this.playlistEdicaoId !== null) {
      this.playlistService.atualizarPlaylist(this.playlistEdicaoId, this.novoNome, this.novaDescricao, this.cursosSelecionados);
    } else {
      this.playlistService.criarPlaylist(this.novoNome, this.novaDescricao, this.cursosSelecionados);
    }

    this.playlists = this.playlistService.getPlaylists();
    this.limparFormulario();
    this.mostrarFormulario = false;
  }

  editarPlaylist(playlist: Playlist) {
    this.playlistEdicaoId = playlist.id;
    this.novoNome = playlist.nome;
    this.novaDescricao = playlist.descricao;
    this.cursosSelecionados = [...playlist.cursos];
    this.mostrarFormulario = true;
  }

  excluirPlaylist(id: number | string) {
    if (confirm('Deseja realmente excluir esta playlist?')) {
      this.playlistService.removerPlaylist(id);
      this.playlists = this.playlistService.getPlaylists();
    }
  }

  getNomeCurso(id: number | string): string {
    return this.cursoService.getCursoPorId(id)?.titulo || 'Curso';
  }

  limparFormulario() {
    this.novoNome = '';
    this.novaDescricao = '';
    this.cursosSelecionados = [];
    this.errorMessage = '';
    this.playlistEdicaoId = null;
  }

  irParaLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
