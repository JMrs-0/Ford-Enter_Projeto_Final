import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Cursos } from './pages/cursos/cursos';
import { AulasAssistidas } from './pages/aulas-assistidas/aulas-assistidas';
import { Playlists } from './pages/playlists/playlists';
import { Dashboard } from './pages/dashboard/dashboard';
import { AssistenteIa } from './pages/assistente-ia/assistente-ia';
import { authGuard } from './guards/auth.guard';

// Rotas da aplicação:
// - A página Home é a página pública inicial ('/' e '/home')
// - O acesso a qualquer outra página requer autenticação via authGuard
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'cursos', component: Cursos, canActivate: [authGuard] },
  { path: 'aulas-assistidas', component: AulasAssistidas, canActivate: [authGuard] },
  { path: 'playlists', component: Playlists, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'assistente-ia', component: AssistenteIa, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }
];
