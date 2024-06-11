import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TableMenuService } from 'src/app/shared/data-access/table/table-menu.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { IRestaurantImage } from 'src/app/shared/model/restaurant/restaurant-image';
import { ITable } from 'src/app/shared/model/table/table';
import { TableService } from '../../../../shared/data-access/table/table.service';
import { ROLES_CONFIG } from './../../../../shared/configs/app-role';

@Component({
  selector: 'app-table-item',
  template: `<div class="table" mat-button [matMenuTriggerFor]="menu">
      <span class="table__name">{{ table().name }}</span>
      <span class="table__seats">{{ table().numOfSeats }}</span>
      <span class="table__status">{{ table().statusId }}</span>
    </div>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="onSelectClick()">
        {{ 'Tables.Select' | translate }}
      </button>
      <a mat-menu-item href="{{ (tableImage | async)?.url }}" target="_blank">{{
        'Tables.Download' | translate
      }}</a>
      <button
        *ngIf="
          authService.isItUserRestaurant(table().restaurantId) &&
          !authService.checkPermission([ROLES_CONFIG.superAdmin])
        "
        mat-menu-item
        (click)="onEditTable()"
      >
        {{ 'Tables.Edit' | translate }}
      </button>
      <button
        *ngIf="
          authService.isItUserRestaurant(table().restaurantId) &&
          !authService.checkPermission([ROLES_CONFIG.superAdmin])
        "
        mat-menu-item
        (click)="onDeleteTable()"
      >
        {{ 'Tables.Delete' | translate }}
      </button>
    </mat-menu>`,
  styleUrls: ['./table-item.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, TranslateModule],
})
export class TableItemComponent implements OnInit {
  table = input.required<ITable>();
  deleteTable = output<void>();
  editTable = output<string>();
  tableImage: Observable<IRestaurantImage> | null = null;

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  authService = inject(AuthService);
  private _tableService = inject(TableService);
  private _tableMenuService = inject(TableMenuService);

  ngOnInit(): void {
    this.tableImage = this._tableService.getTableImage(this.table().id ?? '');
  }

  async onDeleteTable(): Promise<void> {
    if (await this._tableService.deleteTable(this.table().id))
      this.deleteTable.emit();
  }

  onSelectClick(): void {
    this._tableMenuService.selectedTableId = this.table().id ?? null;
  }

  onEditTable(): void {
    this.editTable.emit(this.table()?.id ?? '');
  }
}
