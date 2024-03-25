import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list.component';
import { AuthGuard } from 'src/app/shared/data-access/auth.guard'

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderListRoutingModule {}
