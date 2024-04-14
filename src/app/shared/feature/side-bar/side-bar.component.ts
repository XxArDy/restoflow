import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { ROLES_CONFIG } from '../../configs/app-role';
import { ROUTING_CONFIG } from '../../configs/app-routing.config';
import { ScreenSizeService } from '../../data-access/helpers/screen-size.service';

export interface IRouteList {
  name: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  routeList: IRouteList[] = [
    {
      name: 'orders',
      icon: 'order_approve',
      url: `/${ROUTING_CONFIG.ordersUrl}`,
    },
    { name: 'users', icon: 'group', url: `/${ROUTING_CONFIG.usersUrl}` },
    {
      name: 'restaurants',
      icon: 'restaurant',
      url: `/${ROUTING_CONFIG.restaurantsUrl}`,
    },
    {
      name: 'tables',
      icon: 'table_restaurant',
      url: `/${ROUTING_CONFIG.tablesUrl}`,
    },
    {
      name: 'product',
      icon: 'nutrition ',
      url: `/${ROUTING_CONFIG.productsUrl}`,
    },
    {
      name: 'statistics',
      icon: 'monitoring',
      url: `/${ROUTING_CONFIG.statisticsUrl}`,
    },
  ];
  ROLES_CONFIG = ROLES_CONFIG;

  screenSizeService = inject(ScreenSizeService);
  private _authService = inject(AuthService);

  get authService(): AuthService {
    return this._authService;
  }

  logout(): void {
    this._authService.logout();
  }
}
