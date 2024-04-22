import { Component, inject, OnInit } from '@angular/core';
import { TableMenuService } from 'src/app/shared/data-access/table/table-menu.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class TableReservationComponent implements OnInit {
  minDate = new Date(Date.now());

  tableMenuService = inject(TableMenuService);

  ngOnInit() {
    this.tableMenuService.onTimerOpen();
  }

  // TODO: Reservation
}
