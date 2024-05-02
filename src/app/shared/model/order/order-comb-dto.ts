import { IOrder } from './order';
import { IOrderProductDto } from './order-product-dto';

export interface IOrderCombDto {
  orderDto: IOrder;
  orderProductDtos: IOrderProductDto[];
  message: string;
}
