import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { FilterService } from 'src/app/shared/data-access/helpers/filter.service';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { UserService } from 'src/app/shared/data-access/user/user.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { SharedModule } from 'src/app/shared/shared.module';
import { ROLES_CONFIG } from '../../shared/configs/app-role';
import { AuthService } from './../../shared/data-access/user/auth.service';
import { IUserDto } from './../../shared/model/user/user-dto';
import { UserCreateComponent } from './ui/user-create-edit/user-create.component';
import { UserEditComponent } from './ui/user-create-edit/user-edit.component';
import { UserListComponent } from './ui/user-list/user-list.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [UserListComponent, SharedModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [FilterService],
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('modalContent', { read: ViewContainerRef })
  modalContent!: ViewContainerRef;

  allUserList$!: Observable<IUserDto[]>;

  isModalOpen = false;

  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  filterService = inject(FilterService);
  authService = inject(AuthService);

  private _allRestaurantList: IRestaurant[] = [];
  private _subscribe!: Subscription;

  private _userService = inject(UserService);
  private _restaurantService = inject(RestaurantService);

  ngOnInit(): void {
    this._getAllRestaurants();
    this.updateUser();
  }

  ngOnDestroy(): void {
    this._subscribe.unsubscribe();
  }

  updateUser(): void {
    this.allUserList$ = this.filterService.filter(this.getAllUsers());
    this.closeDialog();
  }

  updateQuery(): void {
    this.filterService.setQuery(this.searchInput.nativeElement.value);
  }

  async openDialog(userId: number = -1): Promise<void> {
    this.modalContent.clear();

    if (userId === -1) {
      const createComp = this.modalContent.createComponent(UserCreateComponent);

      createComp.instance.roles = this._userService.getAllRole();
      createComp.instance.restaurants = this._allRestaurantList;

      createComp.instance.updateUsers.subscribe(() => {
        this.updateUser();
      });
    } else {
      const editComp = this.modalContent.createComponent(UserEditComponent);
      editComp.instance.roles = this._userService.getAllRole();
      editComp.instance.restaurants = this._allRestaurantList;
      const user = await this._userService.getUserById(userId);
      editComp.instance.user = user;

      editComp.instance.lastUserEmail = user?.email!;
      editComp.instance.updateUsers.subscribe(() => {
        this.updateUser();
      });
    }

    this.isModalOpen = true;
  }

  closeDialog(): void {
    this.isModalOpen = false;
  }

  getAllUsers(): Observable<IUserDto[]> {
    return this._userService.getAllUsers().pipe(
      map((res) => {
        if (this.authService.checkPermission([ROLES_CONFIG.superAdmin])) {
          return res.sort((userA, userB) =>
            userA.email.localeCompare(userB.email)
          );
        } else {
          return res
            .filter(
              (user) =>
                user.restaurantId ===
                  this.authService.currentUser?.restaurantId ||
                (user.restaurantId === null &&
                  !user.authorities?.includes(ROLES_CONFIG.superAdmin))
            )
            .sort((userA, userB) => userA.email.localeCompare(userB.email));
        }
      })
    );
  }

  private _getAllRestaurants(): void {
    this._subscribe = this._restaurantService
      .getAllRestaurants()
      .subscribe((res) => {
        this._allRestaurantList = res;
      });
  }
}
