import { Component, input, output } from '@angular/core';
import { Observable } from 'rxjs';
import { IRestaurant } from '../../model/restaurant/restaurant';

@Component({
  selector: 'select-restaurant',
  template: ` <select
    class="select-primary"
    name="restaurants"
    id="restaurants"
    (change)="onRestaurantChange($event)"
  >
    <option disabled selected value="-1">Choose restaurant</option>
    <option
      *ngFor="let restaurant of restaurantList$() | async"
      [value]="restaurant.id"
      [selected]="restaurant.id == selectedRestaurantId()"
    >
      {{ restaurant.name }}
    </option>
  </select>`,
})
export class SelectRestaurantComponent {
  restaurantList$ = input<Observable<IRestaurant[]> | null>();
  selectedRestaurantId = input<number | null>(-1);

  changeRestaurant = output<number>();

  onRestaurantChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.changeRestaurant.emit(Number(target.value));
  }
}
