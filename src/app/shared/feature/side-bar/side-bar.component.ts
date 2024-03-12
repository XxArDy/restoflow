import { Component } from '@angular/core';
import { AccountService } from '../../data-access/account.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  constructor(private accountService: AccountService) {}

  logout() {
    this.accountService.logout();
  }
}
