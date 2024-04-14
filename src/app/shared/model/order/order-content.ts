import { IPageable } from '../helpers/pageable';
import { IOrder } from './order';

export interface IOrderContent {
  content: IOrder[];
  pageable: IPageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: any[];
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
