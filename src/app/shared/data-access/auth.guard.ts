import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (state.url.includes('/login') && !this.accountService.isLoggedIn()) {
      return true;
    } else if (
      state.url.includes('/login') &&
      this.accountService.isLoggedIn()
    ) {
      return this.router.parseUrl('/dashboard/orders');
    } else if (!this.accountService.isLoggedIn()) {
      return this.router.parseUrl('/login');
    }
    return true;
  }
}
