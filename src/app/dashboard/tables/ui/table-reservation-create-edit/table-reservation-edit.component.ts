import { Component, inject, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getCorrectDate } from 'src/app/shared/data-access/helpers/func';
import { ReservationService } from 'src/app/shared/data-access/table/reservation.service';
import { ITableReservation } from 'src/app/shared/model/table/table-reservation';
import { ITableReservationDto } from 'src/app/shared/model/table/table-reservation-dto';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableReservationFormComponent } from './table-reservation-form.component';

@Component({
  selector: 'app-table-reservation-edit',
  standalone: true,
  imports: [SharedModule, TableReservationFormComponent],
  template: `<div class="form-container">
    <h1 class="form__title">Edit reservation</h1>
    <form
      [formGroup]="tableReservationForms"
      (ngSubmit)="onSubmit()"
      class="form"
    >
      <app-table-reservation-form
        [reservationValue]="reservation()?.reservationDto"
        [selectedTableId]="selectedTableId()"
        [restaurantId]="restaurantId()"
      ></app-table-reservation-form>
      <div class="form__btn">
        <button type="submit" class="form__submit">Submit</button>
      </div>
    </form>
  </div>`,
})
export class TableReservationEditComponent {
  reservation = input<ITableReservationDto>();
  selectedTableId = input<string>('');
  restaurantId = input<number>(0);
  updateTableReservation = output<void>();

  tableReservationForms = new FormGroup({});

  private _reservationService = inject(ReservationService);

  async onSubmit(): Promise<void> {
    if (this.tableReservationForms.valid) {
      let reservation: Partial<ITableReservation> = {
        ...this.tableReservationForms.value,
      };

      reservation.reservationDate = getCorrectDate(
        (this.tableReservationForms.get('reservationDate')?.value as
          | Date
          | undefined) ?? new Date()
      )
        .toISOString()
        .split('T')[0];

      const time = (
        this.tableReservationForms.get('reservationTime')?.value ??
        ('' as string)
      ).split(':');
      reservation.reservationTime = time[0] + ':' + time[1];

      if (
        await this._reservationService.updateReservation(
          reservation as ITableReservation
        )
      )
        this.updateTableReservation.emit();
    }
  }
}
