import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUnit } from '../../model/product/unit';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  private baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);

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

  async createUnit(unit: IUnit): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}public/measurement/unit`, {
        method: 'POST',
        body: JSON.stringify(unit),
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('Unit successfully created');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async deleteUnit(id: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}public/measurement/unit/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('Unit successfully deleted');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async updateUnit(unit: IUnit): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}public/measurement/unit/${unit.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(unit),
          headers: await this._authService.getAuthHeaderAsync(),
        }
      );

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('Unit successfully updated');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }
}
