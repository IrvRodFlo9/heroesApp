import { inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';

import { AuthService } from '../services/auth.service';

const checkAuthStatus = (): boolean | Observable<boolean> => {
  //se inyectan el AuthService y el Router

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuth().pipe(
    tap((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigateByUrl('/heroes/list');
      }
    }),
    map((isAuth) => !isAuth)
  );
};

export const publicActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkAuthStatus();
};

export const publicMatchGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  return checkAuthStatus();
};
