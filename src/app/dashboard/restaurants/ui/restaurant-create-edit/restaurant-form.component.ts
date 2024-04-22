import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form__group-line">
      <div class="form__group">
        <label for="address" class="form__label">Address</label>
        <input
          type="text"
          id="address"
          formControlName="address"
          class="form__input"
        />
      </div>
      <div class="form__group">
        <label for="name" class="form__label">Name</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          class="form__input"
        />
      </div>
    </div>
  `,
})
export class RestaurantFormComponent implements OnInit, OnDestroy, OnChanges {
  restaurant = input<IRestaurant | null>({
    id: 0,
    address: '',
    name: '',
  });

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  parentContainer = inject(ControlContainer);
  authService = inject(AuthService);

  ngOnInit() {
    this.parentFormGroup.addControl(
      'address',
      new FormControl(this.restaurant()?.address, Validators.required)
    );
    this.parentFormGroup.addControl(
      'name',
      new FormControl(this.restaurant()?.name, Validators.required)
    );
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl('address');
    this.parentFormGroup.removeControl('name');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['restaurant'] && !changes['restaurant'].firstChange) {
      this.parentFormGroup.get('address')?.setValue(this.restaurant()?.address);
      this.parentFormGroup.get('name')?.setValue(this.restaurant()?.name);
    }
  }
}
