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
import { IUserDto } from '../../model/user/user-dto';
import { AuthService } from '../user/auth.service';
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
  private _toastr = inject(ToastrService);
  private _authService = inject(AuthService);
  private _categoryService = inject(CategoryService);
  private _unitService = inject(UnitsService);

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
    try {
      const response = await fetch(`${this.baseUrl}public/restaurant/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('Restaurant successfully deleted');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async updateRestaurant(
    id: number,
    restaurant: IRestaurant
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}public/restaurant/${id}`, {
        method: 'PUT',
        body: JSON.stringify(restaurant),
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('Restaurant successfully updated');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
    }
  }

  async createRestaurant(restaurant: IRestaurant): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}public/restaurant`, {
        method: 'POST',
        body: JSON.stringify(restaurant),
        headers: await this._authService.getAuthHeaderAsync(),
      });

      if (!response.ok) {
        throw new Error('Unknown error occurred');
      }

      this._toastr.success('Restaurant successfully created');
      return true;
    } catch (error: Error | any) {
      this._toastr.error(error.message, 'Error');
      return false;
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
