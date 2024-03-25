import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/data-access/auth.guard';
import { UserListComponent } from './user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserListRoutingModule {}
