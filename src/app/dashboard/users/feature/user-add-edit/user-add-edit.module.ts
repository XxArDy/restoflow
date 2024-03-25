import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SideBarModule } from 'src/app/shared/feature/side-bar/side-bar.module';
import { UserAddEditRoutingModule } from './user-add-edit-routing.module';
import { UserAddEditComponent } from './user-add-edit.component';

@NgModule({
  declarations: [UserAddEditComponent],
  imports: [
    CommonModule,
    SideBarModule,
    RouterModule,
    UserAddEditRoutingModule,
    ReactiveFormsModule,
  ],
})
export class UserAddEditModule {}
