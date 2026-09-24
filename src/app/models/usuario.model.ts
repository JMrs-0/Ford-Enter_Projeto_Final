// Modelo de usuário - baseado no repositório Ford-Enter_Angular e compliance LGPD
export interface Usuario {
  id: number | string;
  nome: string;
  senha?: string;
  email: string;
  isGuest?: boolean;
  termoLgpdAceito?: boolean;
  dataCadastro?: string;
}
