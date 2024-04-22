import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FilterService } from 'src/app/shared/data-access/helpers/filter.service';
import { TableMenuService } from 'src/app/shared/data-access/table/table-menu.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { ITable } from 'src/app/shared/model/table/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ROLES_CONFIG } from './../../shared/configs/app-role';
import { ScreenSizeService } from './../../shared/data-access/helpers/screen-size.service';
import { TableItemComponent } from './ui/table-item/table-item.component';
import { TableOrderComponent } from './ui/table-order/table-order.component';
import { TableReservationComponent } from './ui/table-reservation/table-reservation.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    SharedModule,
    TableItemComponent,
    TableOrderComponent,
    TableReservationComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [TableMenuService, FilterService],
})
export class TableComponent implements OnInit {
  @ViewChild('modalContent', { read: ViewContainerRef })
  modalContent!: ViewContainerRef;

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  tableList$: Observable<ITable[]> | null = null;

  authService = inject(AuthService);
  screenSizeService = inject(ScreenSizeService);
  tableMenuService = inject(TableMenuService);
  filterService = inject(FilterService);

  ngOnInit(): void {
    this.tableMenuService.init();
    this.tableMenuService.selectedRestaurantId =
      this.authService.currentUser?.restaurantId ?? -1;
    this.filterService.pageElement = 9;
    this.tableList$ = this.filterService.filter(
      this.tableMenuService.tableList$
    );
  }

  onRestaurantChange(target: number): void {
    this.tableMenuService.selectedRestaurantId = target;
  }

  onOpenModal(name: string, id: string = ''): void {
    this.tableMenuService.openModal(name, id, this.modalContent);
  }
}
