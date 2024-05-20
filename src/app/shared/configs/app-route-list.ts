import { ROLES_CONFIG } from './app-role';
import { ROUTING_CONFIG } from './app-routing.config';

export interface IRouteList {
  name: string;
  icon: string;
  url: string;
  permission: string[];
}

export const ROUTE_LIST: IRouteList[] = [
  {
    name: 'Orders.Orders',
    icon: 'order_approve',
    url: `/${ROUTING_CONFIG.ordersUrl}`,
    permission: [],
  },
  {
    name: 'User.Users',
    icon: 'group',
    url: `/${ROUTING_CONFIG.usersUrl}`,
    permission: [ROLES_CONFIG.superAdmin, ROLES_CONFIG.admin],
  },
  {
    name: 'Restaurants.Restaurant',
    icon: 'restaurant',
    url: `/${ROUTING_CONFIG.restaurantsUrl}`,
    permission: [ROLES_CONFIG.superAdmin, ROLES_CONFIG.admin],
  },
  {
    name: 'Tables.Tables',
    icon: 'table_restaurant',
    url: `/${ROUTING_CONFIG.tablesUrl}`,
    permission: [
      ROLES_CONFIG.superAdmin,
      ROLES_CONFIG.admin,
      ROLES_CONFIG.manager,
      ROLES_CONFIG.operator,
    ],
  },
  {
    name: 'Products.Products',
    icon: 'nutrition',
    url: `/${ROUTING_CONFIG.productsUrl}`,
    permission: [
      ROLES_CONFIG.superAdmin,
      ROLES_CONFIG.admin,
      ROLES_CONFIG.manager,
    ],
  },
  {
    name: 'Statistics.Statistics',
    icon: 'monitoring',
    url: `/${ROUTING_CONFIG.statisticsUrl}`,
    permission: [
      ROLES_CONFIG.superAdmin,
      ROLES_CONFIG.admin,
      ROLES_CONFIG.manager,
    ],
  },
];
