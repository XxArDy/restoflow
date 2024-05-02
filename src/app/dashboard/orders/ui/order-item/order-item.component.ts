import {
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, tap } from 'rxjs';
import { WebSocketService } from 'src/app/shared/data-access/web-socket/web-socket.service';
import { IOrderWs } from 'src/app/shared/model/order/order-ws';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  standalone: true,
  imports: [SharedModule, MatButtonModule, MatMenuModule],
})
export class OrderItemComponent implements OnInit, OnChanges {
  tableId = input.required<string | undefined>();
  tableName = input<string>();
  updateStatistic = output<void>();

  get statuses() {
    return environment.orderStatus;
  }
  orderData$: Observable<IOrderWs> | null = null;

  private _webSocketService = inject(WebSocketService);

  ngOnInit(): void {
    this._subscribeToOrder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.orderData$ = null;
    this._subscribeToOrder();
  }

  onStatusChanged(status: 'READY' | 'COOKING' | 'ORDERED') {
    const orderStatusMessage = {
      destination: `/app/order/status/${this.tableId()}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: `"${status}"`,
    };
    this._webSocketService.publish(
      orderStatusMessage.destination,
      orderStatusMessage.headers,
      orderStatusMessage.body
    );
    this._subscribeToOrder();
  }

  private _subscribeToOrder(): void {
    if (this.tableId()) {
      this.orderData$ = this._webSocketService
        .subscribeToTable(this.tableId()!)
        .pipe(tap(() => this.updateStatistic.emit()));

      this._webSocketService.removeOrder(this.tableId()!);
    }
  }
}
