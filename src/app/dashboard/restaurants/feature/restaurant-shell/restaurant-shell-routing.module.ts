import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../restaurant-list/restaurant-list.module').then(
        (m) => m.RestaurantListModule
      ),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('../restaurant-add-edit/restaurant-add-edit.module').then(
        (m) => m.RestaurantAddEditModule
      ),
  },
  {
    path: 'edit',
    data: { edit: true },
    loadChildren: () =>
      import('../restaurant-add-edit/restaurant-add-edit.module').then(
        (m) => m.RestaurantAddEditModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantShellRoutingModule {}
