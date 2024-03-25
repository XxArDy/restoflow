import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { RestaurantService } from '../../data-access/restaurant.service';

@Component({
  selector: 'app-restaurant-add-edit',
  templateUrl: './restaurant-add-edit.component.html',
  styleUrls: ['./restaurant-add-edit.component.scss'],
})
export class RestaurantAddEditComponent implements OnInit {
  restaurantForm!: FormGroup;
  restaurantID: number = -1;

  restaurant: IRestaurant = {
    id: -1,
    address: '',
    name: '',
  };

  private _lastRestaurantId: number = -1;

  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.data['edit']) {
      console.log('ok');
      this.tryGetRestaurantId();
    }
    this.createFrom();
  }

  tryGetRestaurantId(): void {
    this.route.queryParams
      .pipe(
        filter((params) => params && params['restaurant_id'] !== undefined),
        map((params) => Number(params['restaurant_id']))
      )
      .subscribe((restaurantId) => {
        this.restaurantID = restaurantId;
        this.restaurantService
          .getRestaurantById(restaurantId)
          .subscribe((res) => {
            this.restaurant = res;
            this._lastRestaurantId = res.id;
            this.createFrom();
          });
      });
  }

  createFrom(): void {
    this.restaurantForm = new FormGroup({
      address: new FormControl(this.restaurant.address, Validators.required),
      name: new FormControl(this.restaurant.name, Validators.required),
    });
  }

  onSubmit(): void {
    if (this.restaurantForm.valid) {
      this.restaurant = {
        ...this.restaurantForm.value,
      };
      if (this.restaurantID === -1) {
        this.restaurantService
          .createRestaurant(this.restaurant)
          .subscribe((res) => {
            this.toast.success('Restaurant created successful', 'Success');
            this.resetRestaurantForm();
          });
      } else {
        this.restaurantService
          .updateRestaurant(this._lastRestaurantId, this.restaurant)
          .subscribe((res) => {
            this.toast.success('Restaurant updated successful', 'Success');
          });
      }
    }
  }

  resetRestaurantForm(): void {
    this.restaurant = {
      id: -1,
      address: '',
      name: '',
    };

    this.restaurantForm.reset();
    this.restaurantForm.markAsPristine();
    this.restaurantForm.markAsUntouched();
  }
}
