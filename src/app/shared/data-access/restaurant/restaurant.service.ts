import { HttpClient } from '@angular/common/http';
import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CategoryCreateComponent } from 'src/app/dashboard/restaurants/ui/category-create-edit/category-create.component';
import { CategoryEditComponent } from 'src/app/dashboard/restaurants/ui/category-create-edit/category-edit.component';
import { RestaurantCreateComponent } from 'src/app/dashboard/restaurants/ui/restaurant-create-edit/restaurant-create.component';
import { UnitsCreateComponent } from 'src/app/dashboard/restaurants/ui/units-create-edit/units-create.component';
import { UnitsEditComponent } from 'src/app/dashboard/restaurants/ui/units-create-edit/units-edit.component';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { environment } from 'src/environments/environment';
import { RestaurantLocation } from '../../model/restaurant/restaurant-location';
import { IUserDto } from '../../model/user/user-dto';
import { BasicFetchService } from '../helpers/basic-fetch.service';
import { RestaurantsComponent } from './../../../dashboard/restaurants/restaurants.component';
import { CategoryService } from './category.service';
import { UnitsService } from './units.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  baseUrl = environment.apiWarlockUrl;

  restaurantList = new BehaviorSubject<IRestaurant[]>([]);

  isModalOpen = false;

  private _http = inject(HttpClient);
  private _categoryService = inject(CategoryService);
  private _unitService = inject(UnitsService);
  private _basicFetchService = inject(BasicFetchService);
  private _toastr = inject(ToastrService);

  getAllRestaurants(): Observable<IRestaurant[]> {
    return this._http
      .get<IRestaurant[]>(`${this.baseUrl}public/restaurant/all`)
      .pipe(
        tap((res) => {
          this.restaurantList.next(res);
        })
      );
  }

  async getRestaurantById(id: number): Promise<IRestaurant> {
    const response = await fetch(`${this.baseUrl}public/restaurant/${id}`);
    return await response.json();
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    return this._basicFetchService.delete(
      `${this.baseUrl}public/restaurant/${id}`
    );
  }

  async updateRestaurant(
    id: number,
    restaurant: IRestaurant
  ): Promise<IRestaurant | null> {
    return this._basicFetchService.update<IRestaurant>(
      restaurant,
      `${this.baseUrl}public/restaurant/${id}`
    );
  }

  async createRestaurant(restaurant: IRestaurant): Promise<IRestaurant | null> {
    return this._basicFetchService.create<IRestaurant>(
      restaurant,
      `${this.baseUrl}public/restaurant`
    );
  }

  async getLocationInfo(query: string): Promise<RestaurantLocation | null> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&polygon=1&addressdetails=1`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Can`t load location info');
      }

      const data: RestaurantLocation = await response.json();

      if (data.length <= 0) {
        throw new Error('Can`t load location info');
      }

      this._toastr.success('Successfully updated');
      return data;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return null;
    }
  }

  getRestaurantName(user: IUserDto): string {
    const restaurant = this.restaurantList
      .getValue()
      ?.find((restaurant) => restaurant.id === user.restaurantId);
    return restaurant?.name ?? '';
  }

  async openModal(
    modalContent: ViewContainerRef,
    name: 'restaurant' | 'units' | 'category',
    id: number,
    restaurantComponent: RestaurantsComponent
  ): Promise<void> {
    modalContent.clear();
    switch (name) {
      case 'restaurant':
        const restaurantModal = modalContent.createComponent(
          RestaurantCreateComponent
        );
        restaurantModal.instance.updateRestaurants.subscribe(() => {
          restaurantComponent.updateSelectedRestaurant();
          restaurantComponent.closeModal();
        });
        break;
      case 'units':
        if (id === 0) {
          const unitsModal = modalContent.createComponent(UnitsCreateComponent);
          unitsModal.instance.updateUnits.subscribe(() => {
            restaurantComponent.updateUnits();
            restaurantComponent.closeModal();
          });
        } else {
          const unitsModal = modalContent.createComponent(UnitsEditComponent);
          unitsModal.instance.updateUnits.subscribe(() => {
            restaurantComponent.updateUnits();
            restaurantComponent.closeModal();
          });
          unitsModal.setInput('unit', await this._unitService.getUnitById(id));
        }
        break;
      case 'category':
        if (id === 0) {
          const categoryModal = modalContent.createComponent(
            CategoryCreateComponent
          );
          categoryModal.instance.updateCategories.subscribe(() => {
            restaurantComponent.updateCategory();
            restaurantComponent.closeModal();
          });
          categoryModal.setInput(
            'restaurantId',
            restaurantComponent.selectedRestaurantId
          );
        } else {
          const categoryModal = modalContent.createComponent(
            CategoryEditComponent
          );
          categoryModal.instance.updateCategories.subscribe(() => {
            restaurantComponent.updateCategory();
            restaurantComponent.closeModal();
          });
          categoryModal.setInput(
            'category',
            await this._categoryService.getCategoryById(id)
          );
        }
        break;
    }
    this.isModalOpen = true;
  }
}
