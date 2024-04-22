import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { ROLES_CONFIG } from '../../configs/app-role';
import { ROUTING_CONFIG } from '../../configs/app-routing.config';
import { ScreenSizeService } from '../../data-access/helpers/screen-size.service';

export interface IRouteList {
  name: string;
  icon: string;
  url: string;
  permission: string[];
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
      permission: [],
    },
    {
      name: 'users',
      icon: 'group',
      url: `/${ROUTING_CONFIG.usersUrl}`,
      permission: [ROLES_CONFIG.superAdmin, ROLES_CONFIG.admin],
    },
    {
      name: 'restaurants',
      icon: 'restaurant',
      url: `/${ROUTING_CONFIG.restaurantsUrl}`,
      permission: [ROLES_CONFIG.superAdmin, ROLES_CONFIG.admin],
    },
    {
      name: 'tables',
      icon: 'table_restaurant',
      url: `/${ROUTING_CONFIG.tablesUrl}`,
      permission: [
        ROLES_CONFIG.superAdmin,
        ROLES_CONFIG.admin,
        ROLES_CONFIG.manager,
        ROLES_CONFIG.operator,
      ],
    },
    {
      name: 'product',
      icon: 'nutrition ',
      url: `/${ROUTING_CONFIG.productsUrl}`,
      permission: [
        ROLES_CONFIG.superAdmin,
        ROLES_CONFIG.admin,
        ROLES_CONFIG.manager,
      ],
    },
    {
      name: 'statistics',
      icon: 'monitoring',
      url: `/${ROUTING_CONFIG.statisticsUrl}`,
      permission: [
        ROLES_CONFIG.superAdmin,
        ROLES_CONFIG.admin,
        ROLES_CONFIG.manager,
      ],
    },
  ];

  screenSizeService = inject(ScreenSizeService);
  private _authService = inject(AuthService);

  get authService(): AuthService {
    return this._authService;
  }

  logout(): void {
    this._authService.logout();
  }
}
