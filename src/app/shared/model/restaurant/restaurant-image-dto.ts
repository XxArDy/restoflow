import { IPageable } from '../helpers/pageable';
import { ISort } from '../helpers/sort';
import { IRestaurantImage } from './restaurant-image';

export interface IRestaurantImageDto {
  totalPages: number;
  totalElements: number;
  size: number;
  content: IRestaurantImage[];
  number: number;
  sort: ISort;
  numberOfElements: number;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}
