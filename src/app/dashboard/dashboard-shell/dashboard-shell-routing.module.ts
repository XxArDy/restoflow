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
      import('../users/feature/user-list/user-list.module').then(
        (m) => m.UserListModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardShellRoutingModule {}
