import { IRestaurant } from '../restaurant/restaurant';
import { ITable } from './table';
import { ITableReservation } from './table-reservation';

export interface ITableReservationDto {
  reservationDto: ITableReservation;
  tableDto: ITable;
  restaurantDto: IRestaurant;
}
