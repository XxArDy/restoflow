import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RestaurantService } from 'src/app/dashboard/restaurants/data-access/restaurant.service';
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

  private _searchQuery: string = '';
  private _searchUserList: IUserDto[] = [];
  private _allRestaurantList: IRestaurant[] = [];

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.getAllRestaurants();
    this.getAllUsers('');
  }

  getAllUsers(query: string): void {
    this.userService.getAllUsers().subscribe((res) => {
      this.allUserList = res;
      this.changePage(1);
    });
  }

  getAllRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe((res) => {
      this._allRestaurantList = res;
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
      this.getAllUsers('');
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
          .includes(this._searchQuery.toLowerCase())
      );
    });
    this.currentPage = 0;
    this.changePage(1);
  }
}
