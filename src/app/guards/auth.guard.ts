import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

function checkAuthentication() {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn() ? true : router.createUrlTree(['/login']);
}

export const authGuard: CanActivateFn = () => checkAuthentication();
export const authChildGuard: CanActivateChildFn = () => checkAuthentication();
