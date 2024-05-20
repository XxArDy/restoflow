import { Component, inject, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { SharedModule } from 'src/app/shared/shared.module';
import { RestaurantFormComponent } from './restaurant-form.component';

@Component({
  selector: 'app-restaurant-create',
  standalone: true,
  imports: [SharedModule, RestaurantFormComponent],
  template: `<div class="form-container">
    <h1 class="form__title">{{ 'Restaurants.Create' | translate }}</h1>
    <form [formGroup]="restaurantForm" (ngSubmit)="onSubmit()" class="form">
      <app-restaurant-form></app-restaurant-form>
      <div class="form__btn">
        <button type="submit" class="form__submit">
          {{ 'Form.Submit' | translate }}
        </button>
      </div>
    </form>
  </div> `,
})
export class RestaurantCreateComponent {
  updateRestaurants = output<void>();

  restaurantForm = new FormGroup({});

  private _restaurantService = inject(RestaurantService);

  async onSubmit(): Promise<void> {
    if (this.restaurantForm.valid) {
      let restaurant = {
        ...this.restaurantForm.value,
      };

      if (
        await this._restaurantService.createRestaurant(
          restaurant as IRestaurant
        )
      )
        this.updateRestaurants.emit();
    }
  }
}
