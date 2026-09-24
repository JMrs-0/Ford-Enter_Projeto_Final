// Modelos de cursos e aulas - plataforma de estudos

export interface Aula {
  id: number | string;
  titulo: string;
  descricao: string;
  duracao: string; // ex.: "10:32"
  urlVideo: string;
  assistida: boolean;
  progresso: number; // 0-100
}

export interface Curso {
  id: number | string;
  titulo: string;
  descricao: string;
  categoria: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  totalAulas: number;
  cargaHoraria: string;
  img?: string;
  aulas: Aula[];
}

export interface Playlist {
  id: number | string;
  nome: string;
  descricao: string;
  cursos: (number | string)[];  // IDs dos cursos
  dataCriacao: string;
}

export interface ProgressoUsuario {
  cursoId: number | string;
  aulasAssistidas: (number | string)[];
  percentualConcluido: number;
}
