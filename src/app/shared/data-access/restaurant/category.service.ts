import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategory } from '../../model/product/category';
import { BasicFetchService } from '../helpers/basic-fetch.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _basicFetchService = inject(BasicFetchService);

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

  async createCategory(category: ICategory): Promise<ICategory | null> {
    return this._basicFetchService.create<ICategory>(
      category,
      `${this.baseUrl}private/product/category`,
      'You haven`t permission'
    );
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this._basicFetchService.delete(
      `${this.baseUrl}private/product/category/${id}`,
      'You haven`t permission'
    );
  }

  async updateCategory(category: ICategory): Promise<ICategory | null> {
    return this._basicFetchService.update<ICategory>(
      category,
      `${this.baseUrl}private/product/category`,
      'You haven`t permission'
    );
  }
}
