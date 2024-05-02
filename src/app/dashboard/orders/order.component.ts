import { Component, inject, OnInit } from '@angular/core';
import { ROLES_CONFIG } from 'src/app/shared/configs/app-role';
import { OrderViewService } from 'src/app/shared/data-access/order/order-view.service';
import { StatisticService } from 'src/app/shared/data-access/statistic/statistic.service';
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
  totalOrders = 0;
  totalProducts = 0;
  get ROLES_CONFIG() {
    return ROLES_CONFIG;
  }

  authService = inject(AuthService);
  orderViewService = inject(OrderViewService);
  private _statisticService = inject(StatisticService);

  ngOnInit(): void {
    this.orderViewService.init();
    this.onUpdateStatistic();
  }

  onRestaurantChange(target: number): void {
    this.orderViewService.selectedRestaurantId = target;
    this.onUpdateStatistic();
  }

  async onUpdateStatistic(): Promise<void> {
    const response = await this._statisticService.getActiveOrder(
      this.orderViewService.selectedRestaurantId
    );
    this.totalOrders = response.length;

    this.totalProducts = response.reduce((sum, order) => {
      return (
        sum +
        order.orderProductDtos.reduce((productSum, product) => {
          return productSum + product.quantity;
        }, 0)
      );
    }, 0);
  }
}
