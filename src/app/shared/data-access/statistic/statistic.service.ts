import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrderCombDto } from '../../model/order/order-comb-dto';

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
}
