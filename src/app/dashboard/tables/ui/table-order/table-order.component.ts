import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Message } from '@stomp/stompjs';
import { BehaviorSubject, from, map, Subscription, switchMap } from 'rxjs';
import { ProductService } from 'src/app/shared/data-access/product/product.service';
import { WebSocketService } from 'src/app/shared/data-access/web-socket/web-socket.service';
import { IOrderWs } from 'src/app/shared/model/order/order-ws';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-order',
  templateUrl: './table-order.component.html',
  styleUrls: ['./table-order.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class TableOrderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() tableId: string | null = null;

  private _orderData = new BehaviorSubject<IOrderWs | null>(null);

  orderData$ = this._orderData.asObservable();

  get statuses() {
    return environment.orderStatus;
  }

  private _orderSubscription!: Subscription;

  private _webSocketService = inject(WebSocketService);
  private _productService = inject(ProductService);

  ngOnInit(): void {
    this._subscribeToOrder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableId'] && !changes['tableId'].isFirstChange()) {
      this._subscribeToOrder();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeFromWebSocket();
  }

  onStatusChanged(event: Event) {
    const status = (event.target as HTMLInputElement).value;

    const orderStatusMessage = {
      destination: `/app/order/status/${this.tableId}`,
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
  }

  private _subscribeToOrder(): void {
    this._unsubscribeFromWebSocket();

    if (this.tableId !== null) {
      this._orderSubscription = this._webSocketService
        .watch(`/topic/order/${this.tableId}`)
        .pipe(
          switchMap((message: Message) => {
            const orderData = JSON.parse(message.body) as IOrderWs;
            const productDataPromises = orderData.orderProductDtos.map((item) =>
              this._getProductData(item.productId).then((productData) => ({
                ...item,
                ...productData,
              }))
            );
            return from(Promise.all(productDataPromises)).pipe(
              map((orderProductDtos) => ({ ...orderData, orderProductDtos }))
            );
          })
        )
        .subscribe((orderData) => {
          this._orderData.next(orderData);
        });
      this._webSocketService.removeOrder(this.tableId);
    }
  }

  private async _getProductData(productId: number) {
    const product = await this._productService.getProductById(productId);
    const productName = product.productDto.name;
    const productImage = product.imageDto[0]?.url;
    return { productName, productImage };
  }

  private _unsubscribeFromWebSocket(): void {
    if (this._orderSubscription) {
      this._orderData.next(null);
      this._orderSubscription.unsubscribe();
    }
  }
}
