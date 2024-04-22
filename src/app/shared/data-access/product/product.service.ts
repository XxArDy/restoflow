import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/shared/model/product/product';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { IProductDto } from 'src/app/shared/model/product/product-dto';
import { IRestaurantImageDto } from 'src/app/shared/model/restaurant/restaurant-image-dto';
import { environment } from 'src/environments/environment';
import { IRestaurantImage } from '../../model/restaurant/restaurant-image';
import { BasicFetchService } from '../helpers/basic-fetch.service';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _baseUrl = environment.apiDineUrl;

  private _http = inject(HttpClient);
  private _basicFetchService = inject(BasicFetchService);
  private _authService = inject(AuthService);
  private _toastrService = inject(ToastrService);

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

  async createProduct(product: IProduct): Promise<IProduct | null> {
    return this._basicFetchService.create<IProduct>(
      product,
      `${this._baseUrl}private/product`
    );
  }

  async createProductImage(
    productId: number,
    images: File[]
  ): Promise<IRestaurantImage | null> {
    const formData = new FormData();

    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(
        `${this._baseUrl}private/product/image/${productId}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: 'Bearer ' + this._authService.getToken(),
          },
        }
      );

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error('Image upload failed');
      }

      this._toastrService.success('Image upload successfully');
      return data;
    } catch (error: Error | any) {
      this._toastrService.error(error.message, 'Error');
      return null;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this._basicFetchService.delete(
      `${this._baseUrl}private/product/${id}`
    );
  }

  async updateProduct(product: IProduct): Promise<IProduct | null> {
    return this._basicFetchService.update<IProduct>(
      product,
      `${this._baseUrl}private/product/${product.id}`
    );
  }

  async deleteProductImage(id: number): Promise<boolean> {
    return this._basicFetchService.delete(
      `${this._baseUrl}private/product/image/${id}`
    );
  }
}
