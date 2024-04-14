import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TableMenuService } from 'src/app/shared/data-access/table/table-menu.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ROLES_CONFIG } from './../../shared/configs/app-role';
import { ScreenSizeService } from './../../shared/data-access/helpers/screen-size.service';
import { TableItemComponent } from './ui/table-item/table-item.component';
import { TableOrderComponent } from './ui/table-order/table-order.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [SharedModule, TableItemComponent, TableOrderComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [TableMenuService],
})
export class TableComponent implements OnInit {
  @ViewChild('modalContent', { read: ViewContainerRef })
  modalContent!: ViewContainerRef;

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  tableMenuService = inject(TableMenuService);
  authService = inject(AuthService);
  screenSizeService = inject(ScreenSizeService);

  ngOnInit(): void {
    this.tableMenuService.init();
    this.tableMenuService.selectedRestaurantId =
      this.authService.currentUser?.restaurantId!;
  }

  onRestaurantChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.tableMenuService.selectedRestaurantId = Number(target.value);
  }

  onOpenModal(name: string, id: string = ''): void {
    this.tableMenuService.openModal(name, id, this.modalContent);
  }
}
