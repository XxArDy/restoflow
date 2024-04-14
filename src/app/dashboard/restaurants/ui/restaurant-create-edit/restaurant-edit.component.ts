import {
  Component,
  inject,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { SharedModule } from 'src/app/shared/shared.module';
import { ROLES_CONFIG } from './../../../../shared/configs/app-role';
import { RestaurantFormComponent } from './restaurant-form.component';

@Component({
  selector: 'app-restaurant-edit',
  standalone: true,
  imports: [SharedModule, RestaurantFormComponent],
  template: `<div class="form-container">
    <h1 class="form__title">Edit restaurant</h1>
    <form [formGroup]="restaurantForm" (ngSubmit)="onSubmit()" class="form">
      <app-restaurant-form [restaurant]="restaurant"></app-restaurant-form>

      <div class="form__btn">
        <button type="submit" class="form__submit">Submit</button>
        <a
          *ngIf="authService.checkPermission([ROLES_CONFIG.superAdmin])"
          class="form__delete"
          (click)="deleteRestaurant()"
          >Delete</a
        >
      </div>
    </form>
  </div> `,
})
export class RestaurantEditComponent implements OnChanges {
  restaurantId = input.required<number>();

  updateRestaurants = output<void>();

  restaurant: IRestaurant | null = null;

  restaurantForm = new FormGroup({});

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  authService = inject(AuthService);
  private _restaurantService = inject(RestaurantService);

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.restaurantId() === -1) {
      this.restaurant = null;
      return;
    }

    this.restaurant = await this._restaurantService.getRestaurantById(
      this.restaurantId()
    );
  }

  async onSubmit(): Promise<void> {
    if (this.restaurantForm.valid) {
      let restaurant = {
        ...this.restaurantForm.value,
      };

      if (
        await this._restaurantService.updateRestaurant(
          this.restaurantId(),
          restaurant as IRestaurant
        )
      )
        this.updateRestaurants.emit();
    }
  }

  async deleteRestaurant(): Promise<void> {
    if (await this._restaurantService.deleteRestaurant(this.restaurantId()))
      this.updateRestaurants.emit();
  }
}
