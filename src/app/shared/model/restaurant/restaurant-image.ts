export interface IRestaurantImage {
  id: number;
  tableId?: string;
  productId?: number;
  restaurantId?: number;
  storageId?: string;
  fileName: string;
  url: string;
  extension: string;
}
