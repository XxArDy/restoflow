import { IFilterDto } from '../helpers/filter-dto';
import { ITableReservationDto } from './table-reservation-dto';

export interface ITableReservationFilter
  extends IFilterDto<ITableReservationDto> {}
