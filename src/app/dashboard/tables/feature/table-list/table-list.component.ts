import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/data-access/account.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { ITable } from 'src/app/shared/model/table/table';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { TableService } from '../../data-access/table.service';
import { RestaurantService } from './../../../restaurants/data-access/restaurant.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
})
export class TableListComponent implements OnInit {
  tableList: ITable[] = [];
  restaurantList: IRestaurant[] = [];
  isSuperAdmin? = false;
  restaurantId: number = -1;
  currentSelectedTable: ITable | null = null;

  private _currentUser!: IUserDto;

  constructor(
    private tableService: TableService,
    private accountService: AccountService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.accountService.getUserData().subscribe((res) => {
      this._currentUser = res;
      this.isSuperAdmin =
        this._currentUser.authorities?.includes('SUPER_ADMIN');
      if (!this.isSuperAdmin) {
        this.restaurantId = this._currentUser.restaurantId!;
        this.getAllTables();
      } else {
        this.getAllRestaurant();
      }
    });
  }

  getAllRestaurant(): void {
    this.restaurantService.getAllRestaurants().subscribe((res) => {
      this.restaurantList = res;
    });
  }

  getAllTables(): void {
    this.tableService
      .getAllTablesByRestaurantId(this.restaurantId)
      .subscribe((res) => {
        this.tableList = res.content;
      });
  }

  onRestaurantChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.restaurantId = Number(target.value);
    this.getAllTables();
  }

  showOrder(table: ITable): void {
    this.currentSelectedTable = table;
  }
}
