export interface IOrderProductDto {
  orderId: number;
  productId: number;
  quantity: number;

  productImage?: string;
  productName?: string;
}
