import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IRestaurantImage } from 'src/app/shared/model/restaurant/restaurant-image';
import { IPageTableDto } from 'src/app/shared/model/table/page-table-dto';
import { ITable } from 'src/app/shared/model/table/table';
import { environment } from 'src/environments/environment';
import { BasicFetchService } from '../helpers/basic-fetch.service';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _toastr = inject(ToastrService);
  private _basicFetchService = inject(BasicFetchService);

  getAllTablesByRestaurantId(
    restaurantId: number,
    pageNumber: number = 0,
    pageSize: number = 9999
  ): Observable<IPageTableDto> {
    let params = new HttpParams();
    params = params.append('filterBy.restaurantId', restaurantId);
    params = params.append('pagination.page', pageNumber);
    params = params.append('pagination.size', pageSize);
    return this._http.get<IPageTableDto>(`${this.baseUrl}public/table/all`, {
      params,
    });
  }

  async getTableById(id: string): Promise<ITable> {
    const response = await fetch(`${this.baseUrl}public/table/${id}`);
    return await response.json();
  }

  async deleteTable(tableId: string | undefined): Promise<boolean> {
    return this._basicFetchService.delete(
      `${this.baseUrl}private/table/${tableId}`,
      'You haven`t permission'
    );
  }

  async createTable(table: ITable[]): Promise<ITable[] | null> {
    return this._basicFetchService.create<ITable[]>(
      table,
      `${this.baseUrl}private/table`,
      'You haven`t permission'
    );
  }

  async updateTable(tableId: string, table: ITable): Promise<ITable | null> {
    return this._basicFetchService.update<ITable>(
      table,
      `${this.baseUrl}private/table/${tableId}`,
      'You haven`t permission'
    );
  }

  getTableImage(id: string): Observable<IRestaurantImage> {
    return this._http.get<IRestaurantImage>(
      `${this.baseUrl}public/table/image/${id}`
    );
  }
}
