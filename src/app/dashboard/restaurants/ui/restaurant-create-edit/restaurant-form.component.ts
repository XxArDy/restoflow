import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { RestaurantLocation } from 'src/app/shared/model/restaurant/restaurant-location';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="form__group-line">
      <div class="form__group">
        <label for="address" class="form__label">{{
          'Restaurants.Address' | translate
        }}</label>
        <input
          type="text"
          id="address"
          formControlName="address"
          class="form__input"
        />
      </div>
      <div class="form__group">
        <label for="name" class="form__label">{{
          'Restaurants.Name' | translate
        }}</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          class="form__input"
        />
      </div>
    </div>
    <div class="form__group-line">
      <div class="form__group">
        <label for="latitude" class="form__label">{{
          'Restaurants.Latitude' | translate
        }}</label>
        <input
          type="text"
          id="latitude"
          formControlName="latitude"
          class="form__input"
        />
      </div>
      <div class="form__group">
        <label for="longitude" class="form__label">{{
          'Restaurants.Longitude' | translate
        }}</label>
        <input
          type="text"
          id="longitude"
          formControlName="longitude"
          class="form__input"
        />
      </div>
    </div>
    <button type="button" class="add-button" (click)="tryLoadLocation()">
      {{ 'Restaurants.TryLoadLocation' | translate }}
    </button>
  `,
})
export class RestaurantFormComponent implements OnInit, OnDestroy {
  @Input() set restaurantValue(value: IRestaurant | null) {
    this.restaurant = value;
    if (value) this._updateRestaurant();
  }

  restaurant: IRestaurant | null = {
    id: 0,
    address: '',
    name: '',
    latitude: 0,
    longitude: 0,
  };

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  parentContainer = inject(ControlContainer);
  authService = inject(AuthService);

  private _restaurantService = inject(RestaurantService);

  ngOnInit() {
    this.parentFormGroup.addControl(
      'address',
      new FormControl(this.restaurant?.address, Validators.required)
    );
    this.parentFormGroup.addControl(
      'name',
      new FormControl(this.restaurant?.name, Validators.required)
    );
    this.parentFormGroup.addControl(
      'latitude',
      new FormControl(this.restaurant?.latitude, Validators.required)
    );
    this.parentFormGroup.addControl(
      'longitude',
      new FormControl(this.restaurant?.longitude, Validators.required)
    );
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl('address');
    this.parentFormGroup.removeControl('name');
    this.parentFormGroup.removeControl('latitude');
    this.parentFormGroup.removeControl('longitude');
  }

  async tryLoadLocation(): Promise<void> {
    const info: RestaurantLocation | null =
      await this._restaurantService.getLocationInfo(
        this.parentFormGroup.get('address')?.value
      );

    if (info) {
      this.parentFormGroup.get('latitude')?.setValue(info[0].lat);
      this.parentFormGroup.get('longitude')?.setValue(info[0].lon);
    }
  }

  private _updateRestaurant(): void {
    this.parentFormGroup.get('address')?.setValue(this.restaurant?.address);
    this.parentFormGroup.get('name')?.setValue(this.restaurant?.name);
    this.parentFormGroup.get('latitude')?.setValue(this.restaurant?.latitude);
    this.parentFormGroup.get('longitude')?.setValue(this.restaurant?.longitude);
  }
}
