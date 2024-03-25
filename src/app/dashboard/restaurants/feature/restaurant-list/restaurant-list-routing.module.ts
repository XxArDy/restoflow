import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/data-access/auth.guard';
import { RestaurantListComponent } from './restaurant-list.component';

const routes: Routes = [
  {
    path: '',
    component: RestaurantListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantListRoutingModule {}
