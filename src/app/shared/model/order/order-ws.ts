import { IOrderDto } from './order-dto';
import { IOrderProductDto } from './order-product-dto';

export interface IOrderWs {
  orderDto: IOrderDto;
  orderProductDtos: IOrderProductDto[];
}
