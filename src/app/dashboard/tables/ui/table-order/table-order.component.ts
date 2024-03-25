import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/shared/data-access/web-socket.service';
import { IOrderWs } from 'src/app/shared/model/order/order-ws';
import { IProductContent } from 'src/app/shared/model/product/product-content';
import { ITable } from 'src/app/shared/model/table/table';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table-order',
  templateUrl: './table-order.component.html',
  styleUrls: ['./table-order.component.scss'],
})
export class TableOrderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() table: ITable | null = null;
  orderData: IOrderWs | null = null;
  products: IProductContent[] = [];
  statuses: string[] = environment.orderStatus;

  private _orderSubscription!: Subscription;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscribeToOrder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table'] && !changes['table'].isFirstChange()) {
      this.subscribeToOrder();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromWebSocket();
  }

  private subscribeToOrder(): void {
    this.unsubscribeFromWebSocket();

    if (this.table) {
      this._orderSubscription = this.webSocketService
        .watch(`/topic/order/${this.table.id}`)
        .subscribe((message: Message) => {
          this.orderData = JSON.parse(message.body) as IOrderWs;
        });

      this.getAllProduct();
      this.webSocketService.removeOrder(this.table.id!);
    }
  }

  private unsubscribeFromWebSocket(): void {
    if (this._orderSubscription) {
      this._orderSubscription.unsubscribe();
    }
  }

  getAllProduct() {
    // this.productService
    //   .getAllProduct(this.table?.restaurantId!, 0, 1000)
    //   .subscribe((response) => {
    //     this.products = response.dtos;
    //   });
    // TODO: product
  }

  getProductName(id: number): string {
    const productContent = this.products.find(
      (product) => product.productDto.id === id
    );

    if (productContent) {
      return productContent.productDto.name;
    } else {
      return 'Product Not Found';
    }
  }

  onStatusChanged(event: Event) {
    const status = (event.target as HTMLInputElement).value;

    const orderStatusMessage = {
      destination: `/app/order/status/${this.table?.id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: `"${status}"`,
    };
    this.webSocketService.publish(
      orderStatusMessage.destination,
      orderStatusMessage.headers,
      orderStatusMessage.body
    );
  }
}
