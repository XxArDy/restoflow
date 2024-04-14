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
import { TableService } from './table.service';

@Injectable()
export class TableMenuService {
  restaurantList$: Observable<IRestaurant[]> | null = null;
  tableList$: Observable<ITable[]> | null = null;

  isModalOpen = false;

  private _selectedTableId = new BehaviorSubject<string | null>(null);
  private _selectedRestaurantId = new BehaviorSubject<number>(-1);
  private _pageNumber = new BehaviorSubject<number>(0);
  private _maxPages = 0;
  private _currentPage: 'reservation' | 'orders' = 'reservation';

  selectedTable = this._selectedTableId.asObservable();

  set selectedTableId(value: string | null) {
    this._selectedTableId.next(value);
  }

  get selectedTableId() {
    return this._selectedTableId.getValue();
  }

  set selectedRestaurantId(value: number) {
    this._pageNumber.next(0);
    this._maxPages = 0;
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

  set pageNumber(value: number) {
    const temp = this._pageNumber.getValue() + value;
    if (temp <= this._maxPages && temp >= 0) {
      this._pageNumber.next(temp);
    }
  }

  private _restaurantService = inject(RestaurantService);
  private _tableService = inject(TableService);

  public init(): void {
    this.restaurantList$ = this._restaurantService.getAllRestaurants();
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
        break;
    }
    this.isModalOpen = true;
  }

  public onCloseModal(): void {
    this.isModalOpen = false;
  }

  private _getAllTable(): Observable<ITable[]> {
    return combineLatest([this._selectedRestaurantId, this._pageNumber]).pipe(
      switchMap(([selectedRestaurantId, pageNumber]) =>
        this._tableService
          .getAllTablesByRestaurantId(selectedRestaurantId, pageNumber, 9)
          .pipe(
            map((res) => {
              this._maxPages = res.totalPages - 1;
              return res.content;
            })
          )
      )
    );
  }
}
