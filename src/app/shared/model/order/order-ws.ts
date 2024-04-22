import { IOrder } from './order';
import { IOrderProductDto } from './order-product-dto';

export interface IOrderWs {
  orderDto: IOrder;
  orderProductDtos: IOrderProductDto[];
}
