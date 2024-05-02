import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { ROUTE_LIST } from '../../configs/app-route-list';
import { ScreenSizeService } from '../../data-access/helpers/screen-size.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  get routeList() {
    return ROUTE_LIST;
  }

  screenSizeService = inject(ScreenSizeService);
  private _authService = inject(AuthService);

  get authService(): AuthService {
    return this._authService;
  }

  logout(): void {
    this._authService.logout();
  }
}
