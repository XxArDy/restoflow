import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ITable } from 'src/app/shared/model/table/table';
import { IRestaurant } from '../../model/restaurant/restaurant';
import { RestaurantService } from '../restaurant/restaurant.service';
import { TableService } from '../table/table.service';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderViewService {
  restaurantList$: Observable<IRestaurant[]> | null = null;
  tableList$: Observable<ITable[]> | null = null;

  private _selectedRestaurantId$ = new BehaviorSubject<number>(-1);
  selectedTableList: ITable[] = [];

  set selectedRestaurantId(value: number) {
    this._onSelectedRestaurantIdChange(value);
  }

  get selectedRestaurantId$() {
    return this._selectedRestaurantId$.asObservable();
  }

  get selectedRestaurantId() {
    return this._selectedRestaurantId$.getValue();
  }

  private _authService = inject(AuthService);
  private _restaurantService = inject(RestaurantService);
  private _tableService = inject(TableService);

  init(): void {
    this.restaurantList$ = this._restaurantService.getAllRestaurants();

    const userRestaurantId = this._authService.currentUser?.restaurantId ?? -1;
    this.selectedTableList = [];

    if (userRestaurantId !== -1) {
      this._onSelectedRestaurantIdChange(userRestaurantId);
    }
  }

  onSelectTable(table: ITable): void {
    this.selectedTableList.push(table);
  }

  onRemoveTable(tableId: string): void {
    this.selectedTableList = this.selectedTableList.filter(
      (table) => table.id !== tableId
    );
  }

  isInclude(tableId: string): boolean {
    return this.selectedTableList.some((table) => table.id === tableId);
  }

  private _onSelectedRestaurantIdChange(id: number): void {
    this._selectedRestaurantId$.next(id);
    this.tableList$ = this._tableService
      .getAllTablesByRestaurantId(id)
      .pipe(map((res) => res.content));
  }
}
