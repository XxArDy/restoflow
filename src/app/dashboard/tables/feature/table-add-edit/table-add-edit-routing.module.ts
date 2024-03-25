import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/data-access/auth.guard';
import { TableAddEditComponent } from './table-add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TableAddEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableAddEditRoutingModule {}
