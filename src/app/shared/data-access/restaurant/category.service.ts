import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategory } from '../../model/product/category';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);

  getAllCategories(id: number): Observable<ICategory[]> {
    return this._http.get<ICategory[]>(
      `${this.baseUrl}public/product/category/all/${id}`
    );
  }

  async getCategoryById(id: number): Promise<ICategory> {
    const response = await fetch(
      `${this.baseUrl}public/product/category/${id}`
    );
    return await response.json();
  }

  async createCategory(category: ICategory): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}private/product/category`, {
        method: 'POST',
        headers: await this._authService.getAuthHeaderAsync(),
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error('You haven`t permission');
      }

      this._toastr.success('Category successfully created');
      return true;
    } catch (error) {
      if (error instanceof Error) {
        this._toastr.error(error.message, 'Permission denied');
      }
      return false;
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}private/product/category/${id}`,
        {
          method: 'DELETE',
          headers: await this._authService.getAuthHeaderAsync(),
        }
      );

      if (!response.ok) {
        throw new Error('You haven`t permission');
      }

      this._toastr.success('Category successfully deleted');
      return true;
    } catch (error) {
      if (error instanceof Error) {
        this._toastr.error(error.message, 'Permission denied');
      }
      return false;
    }
  }

  async updateCategory(category: ICategory): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}private/product/category/${category.id}`,
        {
          method: 'PUT',
          headers: await this._authService.getAuthHeaderAsync(),
          body: JSON.stringify(category),
        }
      );

      if (!response.ok) {
        throw new Error('You haven`t permission');
      }

      this._toastr.success('Category successfully updated');
      return true;
    } catch (error) {
      if (error instanceof Error) {
        this._toastr.error(error.message, 'Permission denied');
      }
      return false;
    }
  }
}
