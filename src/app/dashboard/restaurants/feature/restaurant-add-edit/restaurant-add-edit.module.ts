import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SideBarModule } from 'src/app/shared/feature/side-bar/side-bar.module';
import { RestaurantAddEditRoutingModule } from './restaurant-add-edit-routing.module';
import { RestaurantAddEditComponent } from './restaurant-add-edit.component';

@NgModule({
  declarations: [RestaurantAddEditComponent],
  imports: [
    CommonModule,
    RestaurantAddEditRoutingModule,
    SideBarModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class RestaurantAddEditModule {}
