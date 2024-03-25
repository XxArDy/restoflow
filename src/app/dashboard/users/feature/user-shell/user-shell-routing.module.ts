import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../user-list/user-list.module').then((m) => m.UserListModule),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('../user-add-edit/user-add-edit.module').then(
        (m) => m.UserAddEditModule
      ),
  },
  {
    path: 'edit',
    data: { edit: true },
    loadChildren: () =>
      import('../user-add-edit/user-add-edit.module').then(
        (m) => m.UserAddEditModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserShellRoutingModule {}
