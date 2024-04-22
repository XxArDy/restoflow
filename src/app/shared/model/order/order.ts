export interface IOrder {
  id: number;
  tableId: string;
  sumToPay: number;
  sumPaid: number;
  tips: number;
  restaurantId: number;
  done: boolean;
  status: string;
  createdDate?: string;
}
