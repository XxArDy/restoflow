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
}
