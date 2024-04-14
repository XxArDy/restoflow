import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IRestaurantImage } from 'src/app/shared/model/restaurant/restaurant-image';
import { IPageTableDto } from 'src/app/shared/model/table/page-table-dto';
import { ITable } from 'src/app/shared/model/table/table';
import { environment } from 'src/environments/environment';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _toastr = inject(ToastrService);

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
    if (tableId === undefined) return false;
    try {
      const response = await fetch(`${this.baseUrl}private/table/${tableId}`, {
        method: 'DELETE',
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error('You haven`t permission');
      }

      this._toastr.success('Table successfully deleted');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Permission denied');
      return false;
    }
  }

  async createTable(table: ITable[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}private/table`, {
        method: 'POST',
        body: JSON.stringify(table),
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error('You haven`t permission');
      }

      this._toastr.success('Tables successfully created');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Permission denied');
      return false;
    }
  }

  async updateTable(tableId: string, table: ITable): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}private/table/${tableId}`, {
        method: 'PUT',
        headers: await this._authService.getAuthHeaderAsync(),
        body: JSON.stringify(table),
      });

      if (!response.ok) {
        throw new Error('You haven`t permission');
      }

      this._toastr.success('Table successfully updated');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Permission denied');
      return false;
    }
  }

  getTableImage(id: string): Observable<IRestaurantImage> {
    return this._http.get<IRestaurantImage>(
      `${this.baseUrl}public/table/image/${id}`
    );
  }
}
