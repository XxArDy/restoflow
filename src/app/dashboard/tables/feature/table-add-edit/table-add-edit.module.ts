import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SideBarModule } from 'src/app/shared/feature/side-bar/side-bar.module';
import { TableAddEditRoutingModule } from './table-add-edit-routing.module';
import { TableAddEditComponent } from './table-add-edit.component';

@NgModule({
  declarations: [TableAddEditComponent],
  imports: [CommonModule, SideBarModule, TableAddEditRoutingModule],
})
export class TableAddEditModule {}
