import { inject, Injectable } from '@angular/core';
import { QueryParamsHandling, Router } from '@angular/router';
import { ROUTING_CONFIG } from '../../configs/app-routing.config';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private _router = inject(Router);

  public navigateTo(
    url: string,
    queryParams: QueryParamsHandling | null = null
  ): Promise<boolean> {
    return this._router.navigate([url], {
      queryParams: { queryParams },
    });
  }

  public toLoginPage(): Promise<boolean> {
    return this.navigateTo(`/${ROUTING_CONFIG.loginUrl}`);
  }

  public toOrdersPage(): Promise<boolean> {
    return this.navigateTo(`/${ROUTING_CONFIG.ordersUrl}`);
  }

  public toUsersPage(): Promise<boolean> {
    return this.navigateTo(`/${ROUTING_CONFIG.usersUrl}`);
  }

  public toRestaurantsPage(): Promise<boolean> {
    return this.navigateTo(`/${ROUTING_CONFIG.restaurantsUrl}`);
  }

  public toProductsPage(): Promise<boolean> {
    return this.navigateTo(`/${ROUTING_CONFIG.productsUrl}`);
  }

  public toTablesPage(): Promise<boolean> {
    return this.navigateTo(`/${ROUTING_CONFIG.tablesUrl}`);
  }

  public toStatisticsPage(): Promise<boolean> {
    return this.navigateTo(`/${ROUTING_CONFIG.statisticsUrl}`);
  }
}
