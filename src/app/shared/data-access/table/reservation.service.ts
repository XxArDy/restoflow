import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITableReservation } from '../../model/table/table-reservation';
import { ITableReservationDto } from '../../model/table/table-reservation-dto';
import { BasicFetchService } from '../helpers/basic-fetch.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private _baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _basicFetchService = inject(BasicFetchService);

  getAllReservations(
    restaurantId: number,
    reservationTime: Date,
    pageNumber: number = 0,
    pageSize: number = 9999
  ): Observable<ITableReservation[]> {
    let params = new HttpParams();
    params = params.append('filterBy.restaurantId', restaurantId);
    params = params.append(
      'filterBy.reservationTime',
      reservationTime.toISOString()
    );
    params = params.append('pagination.page', pageNumber);
    params = params.append('pagination.size', pageSize);
    return this._http
      .get<ITableReservationDto>(`${this._baseUrl}public/reservation/all`, {
        params,
      })
      .pipe(map((reservation) => reservation.content));
  }

  async getReservationById(id: string): Promise<ITableReservation> {
    const response = await fetch(`${this._baseUrl}public/reservation/${id}`);
    return await response.json();
  }

  async deleteReservation(reservationId: number): Promise<boolean> {
    if (!reservationId) return false;
    return this._basicFetchService.delete(
      `${this._baseUrl}public/reservation/${reservationId}`
    );
  }

  async createReservation(
    reservation: ITableReservation
  ): Promise<ITableReservation | null> {
    return this._basicFetchService.create<ITableReservation>(
      reservation,
      `${this._baseUrl}public/reservation`
    );
  }

  async updateReservation(
    reservation: ITableReservation
  ): Promise<ITableReservation | null> {
    return this._basicFetchService.update<ITableReservation>(
      reservation,
      `${this._baseUrl}public/reservation/${reservation.id}`
    );
  }
}
