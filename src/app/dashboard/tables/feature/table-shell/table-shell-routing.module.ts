import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../table-list/table-list.module').then((m) => m.TableListModule),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('../table-add-edit/table-add-edit.module').then(
        (m) => m.TableAddEditModule
      ),
  },
  {
    path: 'edit',
    data: { edit: true },
    loadChildren: () =>
      import('../table-add-edit/table-add-edit.module').then(
        (m) => m.TableAddEditModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableShellRoutingModule {}
