import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrderCombDto } from '../../model/order/order-comb-dto';
import { IProductContent } from '../../model/product/product-content';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  private _baseUrl = environment.apiDineUrl;

  public async getActiveOrder(restaurantId: number): Promise<IOrderCombDto[]> {
    const response = await fetch(
      `${this._baseUrl}public/order/comb?restaurantId=${restaurantId}`
    );
    return await response.json();
  }

  public async getTopProduct(
    restaurantId: number,
    from: Date,
    to: Date
  ): Promise<IProductContent[]> {
    const response = await fetch(`${this._baseUrl}public/product/top`, {
      headers: {
        restaurantId: restaurantId.toString(),
        from: from.toISOString(),
        to: to.toISOString(),
        limit: `${5}`,
      },
    });
    return await response.json();
  }

  public async getTopPromProduct(
    restaurantId: number,
    from: Date,
    to: Date
  ): Promise<IProductContent[]> {
    const response = await fetch(`${this._baseUrl}public/product/top/prom`, {
      headers: {
        restaurantId: restaurantId.toString(),
        from: from.toISOString(),
        to: to.toISOString(),
        limit: `${5}`,
      },
    });
    return await response.json();
  }

  public async getOrdersFromTo(
    restaurantId: number,
    from: Date,
    to: Date
  ): Promise<IOrderCombDto[]> {
    const params = new URLSearchParams({
      restaurantId: restaurantId.toString(),
      from: from.toISOString(),
      to: to.toISOString(),
    });
    const response = await fetch(
      `${this._baseUrl}public/order/comb/between?${params.toString()}`
    );
    return await response.json();
  }

  public async getPromOrdersFromTo(
    restaurantId: number,
    from: Date,
    to: Date
  ): Promise<IOrderCombDto[]> {
    const response = await fetch(`${this._baseUrl}public/order/prom`, {
      headers: {
        restaurantId: restaurantId.toString(),
        from: from.toISOString(),
        to: to.toISOString(),
      },
    });
    return await response.json();
  }
}
