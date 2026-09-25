import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Auth Guard - Protege as páginas internas.
// Se o usuário não estiver logado (nem como visitante), redireciona para /login
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redireciona para login guardando a página que ele tentou acessar
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
