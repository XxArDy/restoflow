import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from '../../data-access/account.service';
import { IUserDto } from '../../model/user/user-dto';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  routeList = [
    ['orders', 'order_approve'],
    ['users', 'group'],
    ['restaurants', 'restaurant'],
    ['tables', 'table_restaurant'],
    ['statistics', 'monitoring'],
  ];

  private _currentUser = new BehaviorSubject<IUserDto | null>(null);

  constructor(private accountService: AccountService) {}
  ngOnInit(): void {
    this.accountService
      .getUserData()
      .subscribe((res) => this._currentUser.next(res));
  }

  logout(): void {
    this.accountService.logout();
  }

  checkPermission(): boolean | undefined {
    const user = this._currentUser.getValue();
    return (
      user?.authorities?.includes('SUPER_ADMIN') ||
      user?.authorities?.includes('ADMIN')
    );
  }
}
