export interface RoutingConfig {
  loginUrl: string;
  ordersUrl: string;
  usersUrl: string;
  restaurantsUrl: string;
  productsUrl: string;
  tablesUrl: string;
  statisticsUrl: string;
}

export const ROUTING_CONFIG: RoutingConfig = {
  loginUrl: 'login',
  ordersUrl: 'dashboard/orders',
  usersUrl: 'dashboard/users',
  restaurantsUrl: 'dashboard/restaurants',
  productsUrl: 'dashboard/products',
  tablesUrl: 'dashboard/tables',
  statisticsUrl: 'dashboard/statistics',
};
