import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/dashboard/users/data-access/user.service';
import { AccountService } from 'src/app/shared/data-access/account.service';
import { IRestaurant } from 'src/app/shared/model/restaurant/restaurant';
import { IUserDto } from 'src/app/shared/model/user/user-dto';
import { RestaurantService } from '../../data-access/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss'],
})
export class RestaurantListComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  allRestaurantList: IRestaurant[] = [];
  showRestaurantList: IRestaurant[] = [];
  currentPage: number = 0;
  pageElement: number = 10;
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  private _searchQuery: string = '';
  private _searchRestaurantList: IRestaurant[] = [];
  private _allRestaurantList: IRestaurant[] = [];
  private _currentUser!: IUserDto;

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getAllRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe((res) => {
      if (this._currentUser.authorities?.includes('SUPER_ADMIN'))
        this.allRestaurantList = res;
      else
        this.router.navigate(['dashboard', 'restaurants', 'edit'], {
          queryParams: { restaurant_id: this._currentUser.restaurantId },
        });

      this.currentPage = 0;
      this.changePage(1);
    });
  }

  getCurrentUser(): void {
    this.accountService.getUserData().subscribe((res) => {
      this._currentUser = res;
      this.getAllRestaurants();
    });
  }

  focusInput(): void {
    this.searchInput.nativeElement.focus();
  }

  deleteRestaurant(restaurant: IRestaurant): void {
    this.restaurantService.deleteRestaurant(restaurant.id!).subscribe((res) => {
      this.getAllRestaurants();
    });
  }

  changePage(number: number): void {
    let allRestaurantList: IRestaurant[] = [];
    if (this._searchQuery === '') allRestaurantList = this.allRestaurantList;
    else allRestaurantList = this._searchRestaurantList;

    const totalPages = Math.ceil(allRestaurantList.length / this.pageElement);
    if (this.currentPage + number < 1 || this.currentPage + number > totalPages)
      return;
    this.currentPage += number;
    this.showRestaurantList = allRestaurantList.slice(
      (this.currentPage - 1) * this.pageElement,
      this.currentPage * this.pageElement
    );
  }

  searchRestaurants(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim();

    this._searchQuery = query;
    this._searchRestaurantList = this.allRestaurantList.filter((restaurant) => {
      return (
        restaurant.address
          ?.toLowerCase()
          .includes(this._searchQuery.toLowerCase()) ||
        restaurant.name?.toLowerCase().includes(this._searchQuery.toLowerCase())
      );
    });
    this.sortField = null;
    this.currentPage = 0;
    this.changePage(1);
  }

  sortData(sortField: keyof IRestaurant): void {
    if (this.sortField === sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = sortField;
      this.sortDirection = 'asc';
    }
    this.showRestaurantList.sort((a, b) => {
      let valueA = a[sortField] || '';
      let valueB = b[sortField] || '';

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
