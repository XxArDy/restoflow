import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { IRole } from 'src/app/shared/model/user/role-dto';
import { IUserDto } from 'src/app/shared/model/user/user-dto';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    TranslateModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input() set userValue(value: IUserDto | undefined) {
    this.user = value;
    if (this.user) this._updateUser();
  }

  roles = input<Observable<IRole[]>>();
  restaurants = input<IRestaurant[]>([]);

  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  user: IUserDto | undefined = {
    id: 0,
    authorities: [],
    restaurantId: null,
    bonusScore: 0,
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: '',
  };

  ngOnInit() {
    this.parentFormGroup.addControl(
      'username',
      new FormControl(this.user?.username)
    );
    this.parentFormGroup.addControl(
      'email',
      new FormControl(this.user?.email, Validators.required)
    );
    this.parentFormGroup.addControl(
      'firstName',
      new FormControl(this.user?.firstName)
    );
    this.parentFormGroup.addControl(
      'lastName',
      new FormControl(this.user?.lastName)
    );
    this.parentFormGroup.addControl(
      'restaurantId',
      new FormControl(this.user?.restaurantId)
    );
    this.parentFormGroup.addControl(
      'bonusScore',
      new FormControl(this.user?.bonusScore)
    );
    this.parentFormGroup.addControl('password', new FormControl(''));
    this.parentFormGroup.addControl(
      'authorities',
      new FormControl(this.user?.authorities)
    );
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl('username');
    this.parentFormGroup.removeControl('email');
    this.parentFormGroup.removeControl('firstName');
    this.parentFormGroup.removeControl('lastName');
    this.parentFormGroup.removeControl('restaurantId');
    this.parentFormGroup.removeControl('bonusScore');
    this.parentFormGroup.removeControl('password');
    this.parentFormGroup.removeControl('authorities');
  }

  onRoleChange(event: MatSlideToggleChange): void {
    const target = event.source;
    const authoritiesControl = this.parentFormGroup?.get('authorities');
    if (event.checked) {
      authoritiesControl?.value.push(target.name);
    } else {
      const roles = authoritiesControl?.value;
      if (roles) {
        authoritiesControl?.setValue(
          roles.filter((role: string) => role !== target.name)
        );
      }
    }
  }

  private _updateUser() {
    this.parentFormGroup.get('username')?.setValue(this.user?.username);
    this.parentFormGroup.get('email')?.setValue(this.user?.email);
    this.parentFormGroup.get('firstName')?.setValue(this.user?.firstName);
    this.parentFormGroup.get('lastName')?.setValue(this.user?.lastName);
    this.parentFormGroup.get('restaurantId')?.setValue(this.user?.restaurantId);
    this.parentFormGroup.get('bonusScore')?.setValue(this.user?.bonusScore);
    this.parentFormGroup.get('password')?.setValue('');
    this.parentFormGroup.get('authorities')?.setValue(this.user?.authorities);
  }
}
