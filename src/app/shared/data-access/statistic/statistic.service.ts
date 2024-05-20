import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrderCombDto } from '../../model/order/order-comb-dto';
import { IProduct } from '../../model/product/product';

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
  ): Promise<IProduct[]> {
    const response = await fetch(`${this._baseUrl}public/order/top`, {
      headers: {
        restaurantId: restaurantId.toString(),
        from: from.toISOString(),
        to: to.toISOString(),
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
}
