import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderComponent } from './dashboard/orders/order.component';
import { ProductsComponent } from './dashboard/products/products.component';
import { RestaurantsComponent } from './dashboard/restaurants/restaurants.component';
import { TableComponent } from './dashboard/tables/table.component';
import { UserComponent } from './dashboard/users/user.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ROUTING_CONFIG } from './shared/configs/app-routing.config';
import { roleGuard } from './shared/data-access/helpers/role.guard';
import { AuthGuard } from './shared/data-access/user/auth.guard';
import { UserResolver } from './shared/data-access/user/user.resolver';

const routes: Routes = [
  {
    path: ROUTING_CONFIG.loginUrl,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver },
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: ROUTING_CONFIG.loginUrl,
    pathMatch: 'full',
  },
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [roleGuard],
    children: [
      {
        path: ROUTING_CONFIG.ordersUrl,
        resolve: { user: UserResolver },
        canActivate: [AuthGuard],
        component: OrderComponent,
      },
      {
        path: ROUTING_CONFIG.usersUrl,
        resolve: { user: UserResolver },
        canActivate: [AuthGuard],
        component: UserComponent,
      },
      {
        path: ROUTING_CONFIG.restaurantsUrl,
        resolve: { user: UserResolver },
        canActivate: [AuthGuard],
        component: RestaurantsComponent,
      },
      {
        path: ROUTING_CONFIG.tablesUrl,
        resolve: { user: UserResolver },
        canActivate: [AuthGuard],
        component: TableComponent,
      },
      {
        path: ROUTING_CONFIG.productsUrl,
        resolve: { user: UserResolver },
        canActivate: [AuthGuard],
        component: ProductsComponent,
      },
      {
        path: ROUTING_CONFIG.statisticsUrl,
        resolve: { user: UserResolver },
        canActivate: [AuthGuard],
        component: OrderComponent,
      },
    ],
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
