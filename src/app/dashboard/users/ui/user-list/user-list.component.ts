import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterService } from 'src/app/shared/data-access/helpers/filter.service';
import { RestaurantService } from 'src/app/shared/data-access/restaurant/restaurant.service';
import { UserService } from 'src/app/shared/data-access/user/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { IUserDto } from './../../../../shared/model/user/user-dto';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class UserListComponent implements OnInit {
  users = input.required<Observable<IUserDto[]>>();

  updateUser = output<void>();
  editUser = output<number>();

  userService = inject(UserService);
  filter = inject(FilterService);
  restaurantService = inject(RestaurantService);

  ngOnInit(): void {
    this.filter.sortData('email');
  }

  async deactivateActivateUser(user: IUserDto): Promise<void> {
    if (await this.userService.deactivateActivateUser(user.id!))
      this.updateUser.emit();
  }
}
