import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SideBarModule } from 'src/app/shared/feature/side-bar/side-bar.module';
import { TableItemComponent } from '../../ui/table-item/table-item.component';
import { TableOrderComponent } from '../../ui/table-order/table-order.component';
import { TableListRoutingModule } from './table-list-routing.module';
import { TableListComponent } from './table-list.component';

@NgModule({
  declarations: [TableListComponent, TableItemComponent, TableOrderComponent],
  imports: [CommonModule, SideBarModule, TableListRoutingModule],
})
export class TableListModule {}
