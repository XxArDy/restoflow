import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/shared/model/product/product';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { IProductDto } from 'src/app/shared/model/product/product-dto';
import { IRestaurantImageDto } from 'src/app/shared/model/restaurant/restaurant-image-dto';
import { environment } from 'src/environments/environment';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _toastr = inject(ToastrService);

  getAllProduct(
    restaurantId: number,
    pageNumber: number = 0,
    pageSize: number = 1000
  ): Observable<IProductDto> {
    let params = new HttpParams();
    params = params.append('filterBy.restaurantId', restaurantId);
    params = params.append('pagination.page', pageNumber);
    params = params.append('pagination.size', pageSize);
    return this._http.get<IProductDto>(`${this._baseUrl}public/product/all`, {
      params,
    });
  }

  getAllProductImage(
    restaurantId: number,
    pageNumber: number = 0,
    pageSize: number = 1000
  ): Observable<IRestaurantImageDto> {
    let params = new HttpParams();
    params = params.append('filterBy.restaurantId', restaurantId);
    params = params.append('pagination.page', pageNumber);
    params = params.append('pagination.size', pageSize);
    return this._http.get<IRestaurantImageDto>(
      `${this._baseUrl}public/product/image`,
      {
        params,
      }
    );
  }

  async getProductById(id: number): Promise<IProductContent> {
    const response = await fetch(`${this._baseUrl}public/product/${id}`);

    return await response.json();
  }

  async createProduct(product: IProduct): Promise<boolean> {
    try {
      const headers = await this._authService.getAuthHeaderAsync();
      const response = await fetch(`${this._baseUrl}private/product`, {
        method: 'POST',
        headers,
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Error creating product');
      }
      this._toastr.success('Product successfully created');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const headers = await this._authService.getAuthHeaderAsync();
      const response = await fetch(`${this._baseUrl}private/product/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error deleting product');
      }
      this._toastr.success('Product successfully deleted');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async updateProduct(product: IProduct): Promise<boolean> {
    try {
      const headers = await this._authService.getAuthHeaderAsync();
      const response = await fetch(
        `${this._baseUrl}private/product/${product.id}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        throw new Error('Error updating product');
      }
      this._toastr.success('Product successfully updated');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async deleteProductImage(id: number): Promise<boolean> {
    try {
      const headers = await this._authService.getAuthHeaderAsync();
      const response = await fetch(
        `${this._baseUrl}private/product/image/${id}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error('Error deleting product image');
      }
      this._toastr.success('Product image successfully deleted');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }
}
