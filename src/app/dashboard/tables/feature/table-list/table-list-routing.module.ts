import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/data-access/auth.guard';
import { TableListComponent } from './table-list.component';

const routes: Routes = [
  {
    path: '',
    component: TableListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableListRoutingModule {}
