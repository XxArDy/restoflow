import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs';
import { RestaurantService } from 'src/app/dashboard/restaurants/data-access/restaurant.service';
import { AccountService } from 'src/app/shared/data-access/account.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { IRole } from 'src/app/shared/model/user/role-dto';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { UserService } from '../../data-access/user.service';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.scss'],
})
export class UserAddEditComponent implements OnInit {
  userForm!: FormGroup;
  userID: number = -1;
  roles: IRole[] = [];
  restaurants: IRestaurant[] = [];

  user: IUserDto = {
    authorities: [],
    bonusScore: 0,
    deleted: false,
    email: '',
    firstName: '',
    lastName: '',
    restaurantId: 0,
    username: '',
  };

  private _currentUser!: IUserDto;
  private _lastUserEmail: string = '';

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    if (this.route.snapshot.data['edit']) {
      console.log('ok');
      this.tryGetUserId();
    }
    this.getAllRestaurants();
    this.createFrom();
  }

  tryGetUserId(): void {
    this.route.queryParams
      .pipe(
        filter((params) => params && params['user_id'] !== undefined),
        map((params) => Number(params['user_id']))
      )
      .subscribe((userId) => {
        this.userID = userId;
        this.userService.getUserById(userId).subscribe((res) => {
          this.user = res;
          this._lastUserEmail = res.email!;
          this.createFrom();
        });
      });
  }

  getCurrentUser(): void {
    this.accountService.getUserData().subscribe((res) => {
      this._currentUser = res;
      this.getAllRole();
    });
  }

  getAllRole(): void {
    this.userService.getAllRole().subscribe((res) => {
      this.roles = res.filter(
        (role) =>
          !(
            this._currentUser.authorities?.includes('ADMIN') &&
            role.role === 'SUPER_ADMIN'
          )
      );
    });
  }

  getAllRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe((res) => {
      this.restaurants = res;
    });
  }

  createFrom(): void {
    this.userForm = new FormGroup({
      username: new FormControl(this.user.username),
      email: new FormControl(this.user.email, Validators.required),
      firstName: new FormControl(this.user.firstName),
      lastName: new FormControl(this.user.lastName),
      restaurantId: new FormControl(this.user.restaurantId),
      bonusScore: new FormControl(this.user.bonusScore),
      password: new FormControl(''),
      authorities: new FormControl(this.user.authorities),
    });
  }

  onRoleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.userForm.get('authorities')?.value.push(target.value);
    } else {
      const roles = this.userForm.get('authorities')?.value;
      if (roles) {
        this.userForm
          .get('authorities')
          ?.setValue(roles.filter((role: string) => role !== target.value));
      }
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.user = {
        ...this.userForm.value,
      };
      this.user.password = undefined;
      if (this.userForm.get('password')?.value) {
        this.user.password = this.userForm.get('password')?.value;
      }
      if (this.userID === -1) {
        this.userService.createUser(this.user).subscribe((res) => {
          this.toast.success('User created successful', 'Success');
          this.resetUserForm();
        });
      } else {
        this.userService
          .updateUser(this._lastUserEmail, this.user)
          .subscribe((res) => {
            this.toast.success('User updated successful', 'Success');
          });
      }
    }
  }

  resetUserForm(): void {
    this.user = {
      authorities: [],
      bonusScore: 0,
      deleted: false,
      email: '',
      firstName: '',
      lastName: '',
      restaurantId: 0,
      username: '',
    };

    this.userForm.reset();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
  }
}
