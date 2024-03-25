export interface IProduct {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  quantity: number;
  measurmentUnitId: number;
  restaurantId: number;
  ingredients: string[];
  cookingTime: number;
  bonusPoints: number;
}
