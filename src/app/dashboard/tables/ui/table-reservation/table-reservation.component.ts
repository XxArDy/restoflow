import { Component, inject, output } from '@angular/core';
import { getCurrentDateInKiev } from 'src/app/shared/data-access/helpers/func';
import { TableMenuService } from 'src/app/shared/data-access/table/table-menu.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableReservationItemComponent } from './table-reservation-item/table-reservation-item.component';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrl: './table-reservation.component.scss',
  standalone: true,
  imports: [SharedModule, TableReservationItemComponent],
})
export class TableReservationComponent {
  createReservation = output<void>();
  editReservation = output<number>();

  minDate = getCurrentDateInKiev();

  tableMenuService = inject(TableMenuService);
}
