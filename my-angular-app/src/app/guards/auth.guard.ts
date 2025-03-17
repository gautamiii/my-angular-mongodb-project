import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const isAuthenticated = !!localStorage.getItem('token'); // Simulating authentication check

  if (!isAuthenticated) {
    router.navigate(['/login']); // Redirect to login if not logged in
    return false;
  }

  return true;
};
