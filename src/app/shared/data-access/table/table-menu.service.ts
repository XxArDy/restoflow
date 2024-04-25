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
import { TableReservationCreateComponent } from 'src/app/dashboard/tables/ui/table-reservation-create-edit/table-reservation-create.component';
import { TableReservationEditComponent } from 'src/app/dashboard/tables/ui/table-reservation-create-edit/table-reservation-edit.component';
import { TableReservationComponent } from 'src/app/dashboard/tables/ui/table-reservation/table-reservation.component';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { IRestaurant } from '../../model/restaurant/restaurant';
import { ITable } from '../../model/table/table';
import { ITableReservationDto } from '../../model/table/table-reservation-dto';
import { getCorrectDate, getCurrentDateInKiev } from '../helpers/func';
import { ReservationService } from './reservation.service';
import { TableService } from './table.service';

@Injectable()
export class TableMenuService {
  restaurantList$: Observable<IRestaurant[]> | null = null;
  tableList$: Observable<ITable[]> | null = null;
  reservationList$: Observable<ITableReservationDto[]> | null = null;

  isModalOpen = false;

  private _selectedTableId = new BehaviorSubject<string | null>(null);
  private _selectedRestaurantId = new BehaviorSubject<number>(-1);
  private _currentPage: 'reservation' | 'orders' = 'reservation';
  private _selectedDate = new BehaviorSubject<Date>(getCurrentDateInKiev());

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
    this._selectedDate.next(getCorrectDate(value));
  }

  get selectedDate() {
    return this._selectedDate.getValue();
  }

  private _restaurantService = inject(RestaurantService);
  private _tableService = inject(TableService);
  private _reservationService = inject(ReservationService);

  public init(): void {
    this.restaurantList$ = this._restaurantService.getAllRestaurants();
    this.updateReservation();
    this.updateTable();
  }

  public updateTable(): void {
    this.tableList$ = this._getAllTable();
  }

  public async openModal(
    name: string,
    id: string | number,
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
        editModal.setInput(
          'table',
          await this._tableService.getTableById(id.toString())
        );
        break;
      case 'orders':
        const orderModal = modalContent.createComponent(TableOrderComponent);
        orderModal.instance.tableId = this.selectedTableId;
        break;
      case 'reservation':
        const reservationModal = modalContent.createComponent(
          TableReservationComponent
        );
        reservationModal.instance.createReservation.subscribe(() => {
          this.onCloseModal();
          this.openModal('reservation.create', '', modalContent);
        });
        reservationModal.instance.editReservation.subscribe((id: number) => {
          this.onCloseModal();
          this.openModal('reservation.edit', id, modalContent);
        });
        break;
      case 'reservation.create':
        const reservationCreateModal = modalContent.createComponent(
          TableReservationCreateComponent
        );
        reservationCreateModal.instance.updateTableReservation.subscribe(() => {
          this.updateReservation();
          this.onCloseModal();
        });
        reservationCreateModal.setInput(
          'selectedTableId',
          this.selectedTableId
        );
        reservationCreateModal.setInput(
          'restaurantId',
          this.selectedRestaurantId
        );
        break;
      case 'reservation.edit':
        const reservationEditModal = modalContent.createComponent(
          TableReservationEditComponent
        );
        reservationEditModal.instance.updateTableReservation.subscribe(() => {
          this.updateReservation();
          this.onCloseModal();
        });
        reservationEditModal.setInput(
          'reservation',
          await this._reservationService.getReservationById(id.toString())
        );
        reservationEditModal.setInput('selectedTableId', this.selectedTableId);
        reservationEditModal.setInput(
          'restaurantId',
          this.selectedRestaurantId
        );
        break;
    }
    this.isModalOpen = true;
  }

  public onCloseModal(): void {
    this.isModalOpen = false;
  }

  public updateReservation(): void {
    this.reservationList$ = this._getAllReservation();
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

  private _getAllReservation(): Observable<ITableReservationDto[]> {
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
