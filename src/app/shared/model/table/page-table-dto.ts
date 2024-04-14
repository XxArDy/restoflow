import { IPageable } from '../helpers/pageable';
import { ISort } from '../helpers/sort';
import { ITable } from './table';

export interface IPageTableDto {
  totalPages: number;
  totalElements: number;
  size: number;
  content: ITable[];
  number: number;
  sort: ISort;
  numberOfElements: number;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}
