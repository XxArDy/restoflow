import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RestaurantService } from 'src/app/dashboard/restaurants/data-access/restaurant.service';
import { AccountService } from 'src/app/shared/data-access/account.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { UserService } from '../../data-access/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  allUserList: IUserDto[] = [];
  showUserList: IUserDto[] = [];
  currentPage: number = 0;
  pageElement: number = 10;
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  private _searchQuery: string = '';
  private _searchUserList: IUserDto[] = [];
  private _allRestaurantList: IRestaurant[] = [];
  private _currentUser!: IUserDto;

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.getAllRestaurants();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe((res) => {
      if (this._currentUser.authorities?.includes('SUPER_ADMIN'))
        this.allUserList = res;
      else
        this.allUserList = res.filter(
          (user) =>
            user.restaurantId === this._currentUser.restaurantId ||
            (user.restaurantId === null &&
              !user.authorities?.includes('SUPER_ADMIN'))
        );
      this.currentPage = 0;
      this.changePage(1);
    });
  }

  getAllRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe((res) => {
      this._allRestaurantList = res;
    });
  }

  getCurrentUser(): void {
    this.accountService.getUserData().subscribe((res) => {
      this._currentUser = res;
      this.getAllUsers();
    });
  }

  getRestaurantName(user: IUserDto): string | undefined {
    return this._allRestaurantList.find(
      (restaurant) => restaurant.id === user.restaurantId
    )?.name;
  }

  focusInput(): void {
    this.searchInput.nativeElement.focus();
  }

  getFullName(user: IUserDto): string {
    return `${user.firstName} ${user.lastName}`;
  }

  deactivateActivateUser(user: IUserDto): void {
    this.userService.deactivateActivateUser(user.id!).subscribe((res) => {
      this.getAllUsers();
    });
  }

  changePage(number: number): void {
    let allUserList: IUserDto[] = [];
    if (this._searchQuery === '') allUserList = this.allUserList;
    else allUserList = this._searchUserList;

    const totalPages = Math.ceil(allUserList.length / this.pageElement);
    if (this.currentPage + number < 1 || this.currentPage + number > totalPages)
      return;
    this.currentPage += number;
    this.showUserList = allUserList.slice(
      (this.currentPage - 1) * this.pageElement,
      this.currentPage * this.pageElement
    );
  }

  searchUsers(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim();

    this._searchQuery = query;
    this._searchUserList = this.allUserList.filter((user) => {
      return (
        user.email?.toLowerCase().includes(this._searchQuery.toLowerCase()) ||
        user.username
          ?.toLowerCase()
          .includes(this._searchQuery.toLowerCase()) ||
        this.getFullName(user)
          .toLowerCase()
          .includes(this._searchQuery.toLowerCase()) ||
        this.getRestaurantName(user)
          ?.toLowerCase()
          .includes(this._searchQuery.toLowerCase())
      );
    });
    this.sortField = null;
    this.currentPage = 0;
    this.changePage(1);
  }

  sortData(sortField: keyof IUserDto | 'fullName' | 'restaurantName'): void {
    if (this.sortField === sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = sortField;
      this.sortDirection = 'asc';
    }
    this.showUserList.sort((a, b) => {
      let valueA: string | number | boolean | undefined | string[];
      let valueB: string | number | boolean | undefined | string[];

      if (sortField === 'fullName') {
        valueA = this.getFullName(a).toLowerCase() || '';
        valueB = this.getFullName(b).toLowerCase() || '';
      } else if (sortField === 'restaurantName') {
        valueA = this.getRestaurantName(a)?.toLowerCase() || '';
        valueB = this.getRestaurantName(b)?.toLowerCase() || '';
      } else {
        valueA = a[sortField] || '';
        valueB = b[sortField] || '';
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
