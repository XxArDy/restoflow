import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService extends RxStomp {
  constructor() {
    super();
  }

  public removeOrder(tableId: string) {
    const removeOrderMessage = {
      destination: `/app/order/remove/${tableId}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ productId: 0, quantity: 0 }]),
    };

    this.publish(removeOrderMessage);
  }
}
