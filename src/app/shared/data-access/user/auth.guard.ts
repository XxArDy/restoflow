import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { ROUTING_CONFIG } from '../../configs/app-routing.config';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    await this.authService.getUserData();
    if (
      state.url.includes(ROUTING_CONFIG.loginUrl) &&
      (await !this.authService.isLoggedIn())
    ) {
      return true;
    } else if (
      state.url.includes(ROUTING_CONFIG.loginUrl) &&
      (await this.authService.isLoggedIn())
    ) {
      return this.router.parseUrl(`/${ROUTING_CONFIG.ordersUrl}`);
    } else if (await !this.authService.isLoggedIn()) {
      return this.router.parseUrl(`/${ROUTING_CONFIG.loginUrl}`);
    }
    return true;
  }
}
