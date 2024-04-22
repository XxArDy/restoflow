import { Component, inject, OnInit } from '@angular/core';
import { ROLES_CONFIG } from 'src/app/shared/configs/app-role';
import { OrderViewService } from 'src/app/shared/data-access/order/order-view.service';
import { AuthService } from 'src/app/shared/data-access/user/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderItemComponent } from './ui/order-item/order-item.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [SharedModule, OrderItemComponent],
})
export class OrderComponent implements OnInit {
  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  authService = inject(AuthService);
  orderViewService = inject(OrderViewService);

  ngOnInit(): void {
    this.orderViewService.init();
  }

  onRestaurantChange(target: number): void {
    this.orderViewService.selectedRestaurantId = target;
  }
}
