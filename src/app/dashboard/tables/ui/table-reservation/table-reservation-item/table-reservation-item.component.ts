import { Component, inject, input, output } from '@angular/core';
import { ReservationService } from 'src/app/shared/data-access/table/reservation.service';
import { UserService } from 'src/app/shared/data-access/user/user.service';
import { ITableReservationDto } from 'src/app/shared/model/table/table-reservation-dto';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-table-reservation-item',
  template: `<div class="card">
    <div class="column">
      <span>{{ fullName }}</span>
      <span>{{ user?.email }}</span>
    </div>
    <div class="column">
      <span>{{ reservation().reservationDto.reservationDate }}</span>
      <span>{{ reservation().reservationDto.reservationTime }}</span>
    </div>
    <div class="row">
      <button-edit
        (click)="editReservation.emit(reservation().reservationDto.id)"
      ></button-edit>
      <button-delete (click)="onDeleteClick()"></button-delete>
    </div>
  </div> `,
  styleUrls: ['./table-reservation-item.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class TableReservationItemComponent {
  reservation = input.required<ITableReservationDto>();

  deleteReservation = output<void>();
  editReservation = output<number>();

  user: IUserDto | null = null;

  get fullName() {
    return this._userService.getFullName(this.user);
  }

  private _reservationService = inject(ReservationService);
  private _userService = inject(UserService);

  async ngOnInit() {
    this.user = await this._userService.getUserById(
      this.reservation().reservationDto.userId
    );
  }

  async onDeleteClick(): Promise<void> {
    if (
      await this._reservationService.deleteReservation(
        this.reservation().reservationDto.id
      )
    ) {
      this.deleteReservation.emit();
    }
  }
}
