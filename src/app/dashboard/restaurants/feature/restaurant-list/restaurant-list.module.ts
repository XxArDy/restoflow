import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SideBarModule } from 'src/app/shared/feature/side-bar/side-bar.module';
import { RestaurantListRoutingModule } from './restaurant-list-routing.module';
import { RestaurantListComponent } from './restaurant-list.component';

@NgModule({
  declarations: [RestaurantListComponent],
  imports: [CommonModule, RestaurantListRoutingModule, SideBarModule],
})
export class RestaurantListModule {}
