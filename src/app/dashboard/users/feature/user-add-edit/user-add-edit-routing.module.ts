import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAddEditComponent } from './user-add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UserAddEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAddEditRoutingModule {}
