import { Injectable } from '@angular/core';
import { Observable, tap, of, throwError } from 'rxjs';
import { Usuario } from '../models/usuario.model';

// AuthService - baseado no repositório Ford-Enter_Angular/services/auth.ts
// Expandido com cadastro de contas, persistência local e modo visitante
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_USER_KEY = 'user';
  private readonly STORAGE_USERS_KEY = 'usuarios_cadastrados';

  // Usuários padrão de teste
  private usuariosPadrao: Usuario[] = [
    { id: 1, nome: 'admin', senha: '1234', email: 'admin@estudos.com', termoLgpdAceito: true },
    { id: 2, nome: 'usuario', senha: '1234', email: 'usuario@estudos.com', termoLgpdAceito: true }
  ];

  constructor() {
    this.inicializarUsuariosPadrao();
  }

  private inicializarUsuariosPadrao(): void {
    const salvos = localStorage.getItem(this.STORAGE_USERS_KEY);
    if (!salvos) {
      localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(this.usuariosPadrao));
    }
  }

  private obterUsuariosCadastrados(): Usuario[] {
    const salvos = localStorage.getItem(this.STORAGE_USERS_KEY);
    if (salvos) {
      try {
        return JSON.parse(salvos);
      } catch {
        return [...this.usuariosPadrao];
      }
    }
    return [...this.usuariosPadrao];
  }

  login(identificador: string, senha: string): Observable<Usuario> {
    const usuarios = this.obterUsuariosCadastrados();
    const termo = identificador.trim().toLowerCase();

    const usuario = usuarios.find(u =>
      (u.nome.toLowerCase() === termo || u.email.toLowerCase() === termo) &&
      u.senha === senha
    );

    if (usuario) {
      // Cria objeto sem expor a senha na sessão
      const sessaoUsuario: Usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        termoLgpdAceito: usuario.termoLgpdAceito,
        dataCadastro: usuario.dataCadastro,
        isGuest: false
      };

      return of(sessaoUsuario).pipe(
        tap(user => {
          localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
        })
      );
    }

    return throwError(() => new Error('Usuário/E-mail ou senha inválidos.'));
  }

  cadastrar(novoUsuario: { nome: string; email: string; senha: string; termoLgpdAceito: boolean }): Observable<Usuario> {
    const usuarios = this.obterUsuariosCadastrados();
    const nomeLimpo = novoUsuario.nome.trim();
    const emailLimpo = novoUsuario.email.trim().toLowerCase();

    // Verificações
    const usuarioExistente = usuarios.find(u =>
      u.nome.toLowerCase() === nomeLimpo.toLowerCase() ||
      u.email.toLowerCase() === emailLimpo
    );

    if (usuarioExistente) {
      return throwError(() => new Error('Já existe uma conta com este nome de usuário ou e-mail.'));
    }

    if (!novoUsuario.termoLgpdAceito) {
      return throwError(() => new Error('É necessário concordar com os Termos da LGPD para se cadastrar.'));
    }

    const usuarioCriado: Usuario = {
      id: Date.now(),
      nome: nomeLimpo,
      email: emailLimpo,
      senha: novoUsuario.senha,
      termoLgpdAceito: true,
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
      isGuest: false
    };

    usuarios.push(usuarioCriado);
    localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(usuarios));

    // Salva na sessão ativa
    const sessaoUsuario: Usuario = {
      id: usuarioCriado.id,
      nome: usuarioCriado.nome,
      email: usuarioCriado.email,
      termoLgpdAceito: true,
      dataCadastro: usuarioCriado.dataCadastro,
      isGuest: false
    };
    localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(sessaoUsuario));

    return of(sessaoUsuario);
  }

  loginAsGuest(): Observable<Usuario> {
    const visitante: Usuario = {
      id: 'guest',
      nome: 'Visitante',
      email: '',
      isGuest: true
    };
    localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(visitante));
    return of(visitante);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_USER_KEY);
  }

  isGuest(): boolean {
    const user = this.getUsuarioAtual();
    return !!user?.isGuest;
  }

  isAuthenticated(): boolean {
    const user = this.getUsuarioAtual();
    return !!user && !user.isGuest;
  }

  getUsuarioAtual(): Usuario | null {
    const user = localStorage.getItem(this.STORAGE_USER_KEY);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
}
