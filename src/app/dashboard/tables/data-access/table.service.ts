import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPageTableDto } from 'src/app/shared/model/table/page-table-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  baseUrl = environment.apiDineUrl;

  constructor(private http: HttpClient) {}

  getAllTablesByRestaurantId(
    restaurantId: number,
    pageNumber: number = 0,
    pageSize: number = 9999
  ): Observable<IPageTableDto> {
    let params = new HttpParams();
    params = params.append('filterBy.restaurantId', restaurantId);
    params = params.append('pagination.page', pageNumber);
    params = params.append('pagination.size', pageSize);
    return this.http.get<IPageTableDto>(`${this.baseUrl}public/table/all`, {
      params,
    });
  }
}
