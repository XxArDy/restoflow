import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'orders',
    loadChildren: () =>
      import('../orders/feature/order-list/order-list.module').then(
        (m) => m.OrderListModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../users/feature/user-shell/user-shell.module').then(
        (m) => m.UserShellModule
      ),
  },
  {
    path: 'restaurants',
    loadChildren: () =>
      import(
        '../restaurants/feature/restaurant-shell/restaurant-shell.module'
      ).then((m) => m.RestaurantShellModule),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('../tables/feature/table-shell/table-shell.module').then(
        (m) => m.TableShellModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardShellRoutingModule {}
