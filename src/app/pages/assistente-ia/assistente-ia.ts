import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Navbar } from '../../components/navbar/navbar';

// AssistenteIa Component - Assistente de estudos com respostas inteligentes de programação
@Component({
  selector: 'app-assistente-ia',
  imports: [NgFor, NgIf, FormsModule, Navbar],
  templateUrl: './assistente-ia.html',
  styleUrl: './assistente-ia.css'
})
export class AssistenteIa implements OnInit {
  mensagemUsuario = '';
  historico: { autor: 'user' | 'ia', texto: string }[] = [];
  aguardando = false;

  // Sugestões de perguntas de exemplo
  sugestoes = [
    'O que é uma arrow function em JavaScript?',
    'Qual a diferença entre let, var e const?',
    'Como funciona o sistema de rotas no Angular?',
    'O que é LGPD e como ela afeta sistemas web?',
    'Explique o conceito de Flexbox no CSS.',
    'Para que serve o Git e o que é commit?'
  ];

  private baseConhecimento: Record<string, string> = {
    'arrow': 'As Arrow Functions (funções de seta) foram introduzidas no ES6. Elas possuem uma sintaxe mais concisa: `const soma = (a, b) => a + b;`. Uma diferença crucial é que elas não criam seu próprio contexto `this`, herdando o `this` do escopo léxico em que foram definidas.',
    'let': '`var` possui escopo de função e sofre içamento (hoisting). `let` e `const` possuem escopo de bloco. A diferença entre `let` e `const` é que `let` permite reatribuição de valor, enquanto `const` declara uma constante imutável por reatribuição.',
    'rotas': 'No Angular, as rotas mapeiam URLs para componentes. Elas são definidas em um array do tipo `Routes` (ex: `[{ path: "cursos", component: Cursos }]`). O componente pai utiliza a diretiva `<router-outlet />` para renderizar a página correspondente à rota acessada.',
    'lgpd': 'A LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018) regulamenta o tratamento de dados pessoais no Brasil. Em sistemas web, você deve garantir bases legais (como consentimento explícito), finalidade definida, segurança dos dados armazenados e facilidade para o titular acessar ou excluir seus dados.',
    'flexbox': 'O CSS Flexbox é um modelo de layout unidimensional (linhas ou colunas). Definindo `display: flex;` no contêiner pai, você pode alinhar e distribuir elementos facilmente usando propriedades como `justify-content` (alinhamento no eixo principal) e `align-items` (alinhamento no eixo transversal).',
    'git': 'Git é um sistema de controle de versão distribuído. Um "commit" registra um instantâneo (snapshot) das alterações realizadas nos arquivos do projeto com uma mensagem descritiva, permitindo rastrear o histórico e trabalhar em equipe com segurança.'
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Mensagem inicial do assistente
    this.historico.push({
      autor: 'ia',
      texto: '👋 Olá! Sou o Assistente IA da EstudoProg. Como posso te ajudar nos seus estudos de programação hoje? Você pode tirar dúvidas sobre HTML, CSS, JavaScript, Angular, LGPD e Git!'
    });
  }

  enviarMensagem() {
    if (!this.mensagemUsuario.trim()) return;

    const pergunta = this.mensagemUsuario.trim();
    this.historico.push({ autor: 'user', texto: pergunta });
    this.mensagemUsuario = '';
    this.aguardando = true;

    // Resposta inteligente baseada na dúvida ou fallback contextual
    setTimeout(() => {
      const resposta = this.gerarResposta(pergunta);
      this.historico.push({
        autor: 'ia',
        texto: resposta
      });
      this.aguardando = false;
    }, 800);
  }

  private gerarResposta(pergunta: string): string {
    const texto = pergunta.toLowerCase();

    for (const [termo, resp] of Object.entries(this.baseConhecimento)) {
      if (texto.includes(termo)) {
        return resp;
      }
    }

    return `Ótima pergunta sobre "${pergunta}"! Nos cursos da plataforma EstudoProg cobrimos esse tópico em detalhes. Recomendamos acessar as aulas práticas no menu "Cursos" para aprofundar seu conhecimento com exemplos reais!`;
  }

  usarSugestao(sugestao: string) {
    this.mensagemUsuario = sugestao;
    this.enviarMensagem();
  }
}
