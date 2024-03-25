import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideBarModule } from 'src/app/shared/feature/side-bar/side-bar.module';
import { UserListRoutingModule } from './user-list-routing.module';
import { UserListComponent } from './user-list.component';

@NgModule({
  declarations: [UserListComponent],
  imports: [CommonModule, SideBarModule, UserListRoutingModule, RouterModule],
})
export class UserListModule {}
