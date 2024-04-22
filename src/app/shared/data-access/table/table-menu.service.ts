import { inject, Injectable, ViewContainerRef } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { TableCreateComponent } from 'src/app/dashboard/tables/ui/table-create-edit/table-create.component';
import { TableEditComponent } from 'src/app/dashboard/tables/ui/table-create-edit/table-edit.component';
import { TableOrderComponent } from 'src/app/dashboard/tables/ui/table-order/table-order.component';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { IRestaurant } from '../../model/restaurant/restaurant';
import { ITable } from '../../model/table/table';
import { ITableReservation } from '../../model/table/table-reservation';
import { ReservationService } from './reservation.service';
import { TableService } from './table.service';

@Injectable()
export class TableMenuService {
  restaurantList$: Observable<IRestaurant[]> | null = null;
  tableList$: Observable<ITable[]> | null = null;
  reservationList$: Observable<ITableReservation[]> | null = null;

  isModalOpen = false;

  private _selectedTableId = new BehaviorSubject<string | null>(null);
  private _selectedRestaurantId = new BehaviorSubject<number>(-1);
  private _currentPage: 'reservation' | 'orders' = 'reservation';
  private _currentTimer = new BehaviorSubject<Date>(new Date());
  private _selectedDate = new BehaviorSubject<Date>(new Date());

  selectedTable = this._selectedTableId.asObservable();

  set selectedTableId(value: string | null) {
    this._selectedTableId.next(value);
  }

  get selectedTableId() {
    return this._selectedTableId.getValue();
  }

  set selectedRestaurantId(value: number) {
    this._selectedRestaurantId.next(value);
  }

  get selectedRestaurantId() {
    return this._selectedRestaurantId.getValue();
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(value: 'orders' | 'reservation') {
    this._currentPage = value;
  }

  set selectedDate(value: Date) {
    this._selectedDate.next(value);
  }

  get selectedDate$() {
    return this._selectedDate.asObservable();
  }
  get selectedDate() {
    return this._selectedDate.getValue();
  }

  get currentTimer$() {
    return this._currentTimer.asObservable();
  }

  private _restaurantService = inject(RestaurantService);
  private _tableService = inject(TableService);
  private _reservationService = inject(ReservationService);

  public init(): void {
    this.restaurantList$ = this._restaurantService.getAllRestaurants();
    this.reservationList$ = this._getAllReservation();
    this.updateTable();
  }

  public updateTable(): void {
    this.tableList$ = this._getAllTable();
  }

  public async openModal(
    name: string,
    id: string,
    modalContent: ViewContainerRef
  ): Promise<void> {
    modalContent?.clear();

    switch (name) {
      case 'create':
        const createModal = modalContent.createComponent(TableCreateComponent);
        createModal.instance.updateTable.subscribe(() => {
          this.updateTable();
          this.onCloseModal();
        });
        break;
      case 'edit':
        const editModal = modalContent.createComponent(TableEditComponent);
        editModal.instance.updateTable.subscribe(() => {
          this.updateTable();
          this.onCloseModal();
        });
        editModal.setInput('table', await this._tableService.getTableById(id));
        break;
      case 'orders':
        const orderModal = modalContent.createComponent(TableOrderComponent);
        orderModal.instance.tableId = this.selectedTableId;
        break;
      case 'reservation':
        // TODO: create reservation component
        break;
    }
    this.isModalOpen = true;
  }

  public onCloseModal(): void {
    this.isModalOpen = false;
  }

  public onTimerOpen(): void {
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    const roundedMinutes = minutes >= 30 ? 60 : 30;
    const roundedHours = roundedMinutes === 60 ? hours + 1 : hours;

    date.setHours(roundedHours);
    date.setMinutes(roundedMinutes % 60);
    date.setSeconds(0);

    this._currentTimer.next(date);
  }

  public onDataSelected(date: Date): void {
    this._selectedDate.next(date);
  }

  private _getAllTable(): Observable<ITable[]> {
    return combineLatest([this._selectedRestaurantId]).pipe(
      switchMap(([selectedRestaurantId]) =>
        this._tableService
          .getAllTablesByRestaurantId(selectedRestaurantId)
          .pipe(
            map((res) => {
              return res.content.sort((a, b) => a.numOfSeats - b.numOfSeats);
            })
          )
      )
    );
  }

  private _getAllReservation(): Observable<ITableReservation[]> {
    return combineLatest([this._selectedRestaurantId, this._selectedDate]).pipe(
      switchMap(([selectedRestaurantId, selectedDate]) =>
        this._reservationService.getAllReservations(
          selectedRestaurantId,
          selectedDate
        )
      )
    );
  }
}
