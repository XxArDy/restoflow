import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { IMessage, Message } from '@stomp/stompjs';
import { from, map, Observable, switchMap } from 'rxjs';
import { myRxStompConfig } from 'src/app/shared/data-access/web-socket/my-rx-stomp.config';
import { IOrderWs } from '../../model/order/order-ws';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private rxStomp: RxStomp;

  constructor(private _productService: ProductService) {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure(myRxStompConfig);
    this.rxStomp.activate();
  }

  public watch(destination: string): Observable<IMessage> {
    return this.rxStomp.watch(destination);
  }

  public publish(destination: string, headers: any, body: any): void {
    this.rxStomp.publish({ destination, headers, body });
  }

  public removeOrder(tableId: string): void {
    const removeOrderMessage = {
      destination: `/app/order/remove/${tableId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ productId: 0, quantity: 0 }]),
    };

    this.publish(
      removeOrderMessage.destination,
      removeOrderMessage.headers,
      removeOrderMessage.body
    );
  }

  public subscribeToTable(tableId: string): Observable<IOrderWs> {
    return this.watch(`/topic/order/${tableId}`).pipe(
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
    );
  }

  private async _getProductData(productId: number) {
    const product = await this._productService.getProductById(productId);
    const productName = product.productDto.name;
    const productImage = product.imageDto[0]?.url;
    return { productName, productImage };
  }
}
