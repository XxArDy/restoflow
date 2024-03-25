import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  baseUrl = environment.apiWarlockUrl;
  constructor(private http: HttpClient) {}

  getAllRestaurants(): Observable<IRestaurant[]> {
    return this.http.get<IRestaurant[]>(`${this.baseUrl}public/restaurant/all`);
  }

  getRestaurantById(id: number): Observable<IRestaurant> {
    return this.http.get<IRestaurant>(`${this.baseUrl}public/restaurant/${id}`);
  }

  deleteRestaurant(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}public/restaurant/${id}`);
  }

  updateRestaurant(
    id: number,
    restaurant: IRestaurant
  ): Observable<IRestaurant> {
    return this.http.put<IRestaurant>(
      `${this.baseUrl}public/restaurant/${id}`,
      restaurant
    );
  }

  createRestaurant(restaurant: IRestaurant): Observable<IRestaurant> {
    return this.http.post<IRestaurant>(
      `${this.baseUrl}public/restaurant`,
      restaurant
    );
  }
}
