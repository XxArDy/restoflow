import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from 'src/app/shared/data-access/web-socket/web-socket.service';
import { IOrderWs } from 'src/app/shared/model/order/order-ws';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-table-order',
  templateUrl: './table-order.component.html',
  styleUrls: ['./table-order.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class TableOrderComponent implements OnInit, OnChanges {
  @Input() tableId: string | null = null;

  orderData$: Observable<IOrderWs> | null = null;

  private _webSocketService = inject(WebSocketService);

  ngOnInit(): void {
    this._subscribeToOrder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableId'] && !changes['tableId'].isFirstChange()) {
      this._subscribeToOrder();
    }
  }

  private _subscribeToOrder(): void {
    if (this.tableId) {
      this.orderData$ = this._webSocketService.subscribeToTable(this.tableId!);

      this._webSocketService.removeOrder(this.tableId);
    }
  }
}
