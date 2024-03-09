import { IProductContent } from './product-content';

export interface IProductDto {
  dtos: IProductContent[];
  totalElements: number;
}
