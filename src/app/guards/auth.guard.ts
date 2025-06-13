import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.validateToken().pipe(
    take(1),
    map(isValid => {
      if (isValid) {
        return true;
      } else {
        // Store the attempted URL for redirecting after login
        router.navigate(['/admin/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    })
  );
};