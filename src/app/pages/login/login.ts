import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/usuario.model';

// Login & Cadastro Component - baseado no repositório Ford-Enter_Angular e Ford-Enter_LGPD
@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  abaAtiva: 'login' | 'cadastro' = 'login';
  usuarioAtual: Usuario | null = null;

  // Campos de Login
  identificador = '';
  senha = '';
  errorMessage = '';
  successMessage = '';

  // Campos de Cadastro
  novoNome = '';
  novoEmail = '';
  novaSenha = '';
  confirmarSenha = '';
  concordaLgpd = false;
  cadastroErrorMessage = '';

  // Modal LGPD
  modalLgpdAberto = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuarioAtual = this.authService.getUsuarioAtual();
  }

  trocarAba(aba: 'login' | 'cadastro') {
    this.abaAtiva = aba;
    this.errorMessage = '';
    this.cadastroErrorMessage = '';
    this.successMessage = '';
  }

  // Login de usuário existente (padrão ou cadastrado)
  onSubmitLogin() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.identificador || !this.senha) {
      this.errorMessage = 'Preencha todos os campos para entrar.';
      return;
    }

    this.authService.login(this.identificador, this.senha).subscribe({
      next: (user) => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Usuário ou senha inválidos.';
      }
    });
  }

  // Cadastro de nova conta com validação e aceite da LGPD
  onSubmitCadastro() {
    this.cadastroErrorMessage = '';
    this.successMessage = '';

    if (!this.novoNome || !this.novoEmail || !this.novaSenha || !this.confirmarSenha) {
      this.cadastroErrorMessage = 'Por favor, preencha todos os campos do cadastro.';
      return;
    }

    if (this.novaSenha.length < 4) {
      this.cadastroErrorMessage = 'A senha deve conter no mínimo 4 caracteres.';
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.cadastroErrorMessage = 'As senhas digitadas não coincidem.';
      return;
    }

    if (!this.concordaLgpd) {
      this.cadastroErrorMessage = 'Você precisa concordar com os Termos de Privacidade (LGPD) para prosseguir.';
      return;
    }

    this.authService.cadastrar({
      nome: this.novoNome,
      email: this.novoEmail,
      senha: this.novaSenha,
      termoLgpdAceito: true
    }).subscribe({
      next: (user) => {
        this.successMessage = `Conta criada com sucesso! Bem-vindo(a), ${user.nome}!`;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        this.cadastroErrorMessage = err.message || 'Erro ao realizar cadastro.';
      }
    });
  }

  // Entrar sem login (Modo Visitante)
  entrarComoVisitante() {
    this.authService.loginAsGuest().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      }
    });
  }

  continuarSessao() {
    this.router.navigate(['/home']);
  }

  encerrarSessaoAtual() {
    this.authService.logout();
    this.usuarioAtual = null;
  }

  abrirModalLgpd() {
    this.modalLgpdAberto = true;
  }

  fecharModalLgpd() {
    this.modalLgpdAberto = false;
  }

  aceitarLgpdEFechar() {
    this.concordaLgpd = true;
    this.modalLgpdAberto = false;
  }
}
