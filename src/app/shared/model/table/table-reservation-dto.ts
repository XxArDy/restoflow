import { IPageable } from '../helpers/pageable';
import { ISort } from '../helpers/sort';
import { ITableReservation } from './table-reservation';

export interface ITableReservationDto {
  totalPages: number;
  totalElements: number;
  size: number;
  content: ITableReservation[];
  number: number;
  sort: ISort;
  numberOfElements: number;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}
