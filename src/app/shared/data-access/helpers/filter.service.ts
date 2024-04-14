import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
} from 'rxjs';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UserService } from '../user/user.service';

@Injectable()
export class FilterService {
  private _query = new BehaviorSubject<string>('');
  private _currentPage = new BehaviorSubject<number>(1);
  private _pageElement = new BehaviorSubject<number>(10);
  private _sortField = new BehaviorSubject<string>('');
  private _sortDirection = new BehaviorSubject<'asc' | 'desc'>('asc');

  private _userService = inject(UserService);
  private _restaurantService = inject(RestaurantService);

  private unsubscribe$ = new Subscription();

  set pageElement(number: number) {
    this._pageElement.next(number);
  }

  get sortField() {
    return this._sortField.getValue();
  }

  get sortDirection() {
    return this._sortDirection.getValue();
  }

  public changePage(number: number, list: Observable<any[]> | null): void {
    if (list === null) return;
    this.unsubscribe$ = list.subscribe((allUserList) => {
      const totalPages = Math.ceil(
        allUserList.length / this._pageElement.value
      );
      if (
        this._currentPage.value + number >= 1 &&
        this._currentPage.value + number <= totalPages
      )
        this._currentPage.next(this._currentPage.value + number);
      this._unsubscribe();
    });
  }

  public setQuery(query: string) {
    this._query.next(query);
    this._currentPage.next(1);
  }

  public sortData(sortField: string): void {
    if (this._sortField.value === sortField) {
      this._sortDirection.next(
        this._sortDirection.value === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this._sortField.next(sortField);
      this._sortDirection.next('asc');
    }
  }

  public filter(list: Observable<any[]>): Observable<any[]> {
    return combineLatest([
      this._query,
      this._sortField,
      this._sortDirection,
      this._currentPage,
      this._pageElement,
      list,
    ]).pipe(
      map(
        ([
          query,
          sortField,
          sortDirection,
          currentPage,
          pageElement,
          userList,
        ]) => {
          let queryList = userList || [];

          if (query !== '') {
            queryList = queryList.filter((item: any) => {
              if ('restaurantId' in item) {
                return (
                  this._restaurantService
                    .getRestaurantName(item)
                    .toLowerCase()
                    .includes(query.toLowerCase()) ||
                  Object.values(item).some((value) =>
                    value
                      ?.toString()
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  )
                );
              } else {
                return Object.values(item).some((value) =>
                  value?.toString().toLowerCase().includes(query.toLowerCase())
                );
              }
            });
          }

          if (sortField !== '') {
            queryList.sort((a, b) => {
              let valueA: string | number | boolean | string[];
              let valueB: string | number | boolean | string[];
              if (sortField === 'fullName') {
                valueA = this._userService.getFullName(a).toLowerCase() || '';
                valueB = this._userService.getFullName(b).toLowerCase() || '';
              } else if (sortField === 'restaurantName') {
                valueA =
                  this._restaurantService.getRestaurantName(a).toLowerCase() ||
                  '';
                valueB =
                  this._restaurantService.getRestaurantName(b)?.toLowerCase() ||
                  '';
              } else {
                valueA = a[sortField] || '';
                valueB = b[sortField] || '';
              }
              if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
              if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
              return 0;
            });
          }

          let filteredList = queryList.slice(
            (currentPage - 1) * pageElement,
            currentPage * pageElement
          );
          return filteredList;
        }
      )
    );
  }

  private _unsubscribe(): void {
    this.unsubscribe$.unsubscribe();
  }
}
