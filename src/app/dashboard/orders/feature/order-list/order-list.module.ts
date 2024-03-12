import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SideBarModule } from 'src/app/shared/feature/side-bar/side-bar.module';
import { OrderListRoutingModule } from './order-list-routing.module';
import { OrderListComponent } from './order-list.component';

@NgModule({
  declarations: [OrderListComponent],
  imports: [CommonModule, OrderListRoutingModule, SideBarModule],
})
export class OrderListModule {}
