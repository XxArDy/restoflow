import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROUTE_LIST } from '../../configs/app-route-list';
import { AuthService } from '../user/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _authService = inject(AuthService);

  const currentUrl = state.url;

  const userRoles = _authService.currentUser?.authorities || [];

  const hasPermission = checkPermission(currentUrl, userRoles);

  if (!hasPermission) {
    _router.navigate(['/']);
    return false;
  }

  return true;
};

function checkPermission(url: string, roles: string[]): boolean {
  for (let route of ROUTE_LIST) {
    if (route.url === url) {
      if (route.permission.length === 0) {
        return true;
      }

      for (let role of roles) {
        if (route.permission.includes(role)) {
          return true;
        }
      }
    }
  }

  return false;
}
