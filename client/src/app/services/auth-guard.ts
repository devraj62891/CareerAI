import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './api';

/**
 * Simple route guard: if the user is NOT logged in, send them to /login.
 * Used to protect the dashboard route.
 */
export const authGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  const router = inject(Router);

  if (api.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
