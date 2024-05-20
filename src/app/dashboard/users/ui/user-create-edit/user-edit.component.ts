import { Component, inject, Input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/data-access/user/user.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { IRole } from 'src/app/shared/model/user/role-dto';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-edit',
  template: `<div class="form-container">
    <h1 class="form__title">{{ 'User.Edit' | translate }}</h1>
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="form">
      <app-user-form
        controlKey="userForm"
        [roles]="roles"
        [restaurants]="restaurants"
        [userValue]="user"
      ></app-user-form>
      <div class="form__btn">
        <button type="submit" class="form__submit">
          {{ 'Form.Submit' | translate }}
        </button>
      </div>
    </form>
  </div> `,
  standalone: true,
  imports: [SharedModule, UserFormComponent],
})
export class UserEditComponent {
  @Input() roles!: Observable<IRole[]>;
  @Input() restaurants: IRestaurant[] = [];
  @Input({ required: true }) user: IUserDto | undefined = undefined;

  updateUsers = output<void>();

  userForm = new FormGroup({});

  lastUserEmail = '';

  private _userService = inject(UserService);

  async onSubmit(): Promise<void> {
    if (this.userForm.valid) {
      let user: Partial<IUserDto> = {
        ...this.userForm.value,
      };

      user.password = undefined;
      if (this.userForm.get('password')?.value) {
        user.password = this.userForm.get('password')?.value;
      }
      if (
        await this._userService.updateUser(this.lastUserEmail, user as IUserDto)
      )
        this.updateUsers.emit();
    }
  }
}
