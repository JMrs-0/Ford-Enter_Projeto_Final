import { Injectable } from '@angular/core';
import { Playlist } from '../models/curso.model';

// Serviço de playlists de estudo
@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlists: Playlist[] = [];

  constructor() {
    this.playlists = this.carregarPlaylists();
  }

  getPlaylists(): Playlist[] {
    return this.playlists;
  }

  criarPlaylist(nome: string, descricao: string, cursos: (number | string)[]): Playlist {
    const novaPlaylist: Playlist = {
      id: Date.now(),
      nome,
      descricao,
      cursos,
      dataCriacao: new Date().toLocaleDateString('pt-BR')
    };
    this.playlists.push(novaPlaylist);
    this.salvarPlaylists();
    return novaPlaylist;
  }

  removerPlaylist(id: number | string): void {
    this.playlists = this.playlists.filter(p => p.id !== id);
    this.salvarPlaylists();
  }

  atualizarPlaylist(id: number | string, nome: string, descricao: string, cursos: (number | string)[]): void {
    const index = this.playlists.findIndex(p => p.id === id);
    if (index !== -1) {
      this.playlists[index] = { ...this.playlists[index], nome, descricao, cursos };
      this.salvarPlaylists();
    }
  }

  adicionarCursoNaPlaylist(playlistId: number | string, cursoId: number | string): void {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.cursos.includes(cursoId)) {
      playlist.cursos.push(cursoId);
      this.salvarPlaylists();
    }
  }

  private carregarPlaylists(): Playlist[] {
    const data = localStorage.getItem('playlists_estudo');
    return data ? JSON.parse(data) : [];
  }

  private salvarPlaylists(): void {
    localStorage.setItem('playlists_estudo', JSON.stringify(this.playlists));
  }
}
