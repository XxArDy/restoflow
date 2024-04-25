import { Time } from '@angular/common';

export interface ITableReservation {
  id: number;
  tableId: string;
  userId: number;
  reservationTime: Time | string;
  reservationDate: Date | string;
  createdDate: string;
}
