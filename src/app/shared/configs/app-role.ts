export interface RoleInterface {
  user: string;
  admin: string;
  operator: string;
  manager: string;
  superAdmin: string;
  cook: string;
  waiter: string;
}

export const ROLES_CONFIG: RoleInterface = {
  user: 'USER',
  admin: 'ADMIN',
  operator: 'OPERATOR',
  manager: 'MANAGER',
  superAdmin: 'SUPER_ADMIN',
  cook: 'COOK',
  waiter: 'WAITER',
};
