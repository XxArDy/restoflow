import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { myRxStompConfig } from 'src/app/shared/data-access/web-socket/my-rx-stomp.config';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private rxStomp: RxStomp;

  constructor() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure(myRxStompConfig);
    this.rxStomp.activate();
  }

  public watch(destination: string) {
    return this.rxStomp.watch(destination);
  }

  public publish(destination: string, headers: any, body: any) {
    this.rxStomp.publish({ destination, headers, body });
  }

  public removeOrder(tableId: string) {
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
}
