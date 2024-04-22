import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ROLES_CONFIG } from 'src/app/shared/configs/app-role';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { TableService } from 'src/app/shared/data-access/table/table.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { IPageTableDto } from 'src/app/shared/model/table/page-table-dto';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderItemComponent } from './ui/order-item/order-item.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [SharedModule, OrderItemComponent],
})
export class OrderComponent implements OnInit {
  restaurantList$: Observable<IRestaurant[]> | null = null;
  tableList$: Observable<IPageTableDto> | null = null;

  selectedRestaurantId$ = new BehaviorSubject<number>(-1);

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  authService = inject(AuthService);
  private _restaurantService = inject(RestaurantService);
  private _tableService = inject(TableService);

  ngOnInit(): void {
    this.restaurantList$ = this._restaurantService.getAllRestaurants();

    const userRestaurantId = this.authService.currentUser?.restaurantId ?? -1;

    if (userRestaurantId !== -1) {
      this.selectedRestaurantId$.next(userRestaurantId);
      this.tableList$ =
        this._tableService.getAllTablesByRestaurantId(userRestaurantId);
    }
  }

  onRestaurantChange(target: number): void {
    this.selectedRestaurantId$.next(target);
    this.tableList$ = this._tableService.getAllTablesByRestaurantId(target);
  }
}
