import { IRestaurantImage } from '../restaurant/restaurant-image';
import { IProduct } from './product';

export interface IProductContent {
  productDto: IProduct;
  imageDto: IRestaurantImage[];
}
