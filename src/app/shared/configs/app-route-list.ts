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
    name: 'orders',
    icon: 'order_approve',
    url: `/${ROUTING_CONFIG.ordersUrl}`,
    permission: [],
  },
  {
    name: 'users',
    icon: 'group',
    url: `/${ROUTING_CONFIG.usersUrl}`,
    permission: [ROLES_CONFIG.superAdmin, ROLES_CONFIG.admin],
  },
  {
    name: 'restaurants',
    icon: 'restaurant',
    url: `/${ROUTING_CONFIG.restaurantsUrl}`,
    permission: [ROLES_CONFIG.superAdmin, ROLES_CONFIG.admin],
  },
  {
    name: 'tables',
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
    name: 'product',
    icon: 'nutrition ',
    url: `/${ROUTING_CONFIG.productsUrl}`,
    permission: [
      ROLES_CONFIG.superAdmin,
      ROLES_CONFIG.admin,
      ROLES_CONFIG.manager,
    ],
  },
  {
    name: 'statistics',
    icon: 'monitoring',
    url: `/${ROUTING_CONFIG.statisticsUrl}`,
    permission: [
      ROLES_CONFIG.superAdmin,
      ROLES_CONFIG.admin,
      ROLES_CONFIG.manager,
    ],
  },
];
