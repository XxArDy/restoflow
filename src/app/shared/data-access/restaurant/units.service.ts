import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUnit } from '../../model/product/unit';
import { BasicFetchService } from '../helpers/basic-fetch.service';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  private baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _basicFetchService = inject(BasicFetchService);

  getAllUnits(): Observable<IUnit[]> {
    return this._http.get<IUnit[]>(
      `${this.baseUrl}public/measurement/unit/all`
    );
  }

  async getUnitById(id: number): Promise<IUnit> {
    const response = await fetch(
      `${this.baseUrl}public/measurement/unit/${id}`
    );
    return await response.json();
  }

  async createUnit(unit: IUnit): Promise<IUnit | null> {
    return this._basicFetchService.create<IUnit>(
      unit,
      `${this.baseUrl}public/measurement/unit`
    );
  }

  async deleteUnit(id: number): Promise<boolean> {
    return this._basicFetchService.delete(
      `${this.baseUrl}public/measurement/unit/${id}`
    );
  }

  async updateUnit(unit: IUnit): Promise<IUnit | null> {
    return this._basicFetchService.update<IUnit>(
      unit,
      `${this.baseUrl}public/measurement/unit/${unit.id}`
    );
  }
}
