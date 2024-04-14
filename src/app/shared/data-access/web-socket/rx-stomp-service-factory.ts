import { myRxStompConfig } from './my-rx-stomp.config';
import { WebSocketService } from './web-socket.service';

export function rxStompServiceFactory() {
  const rxStomp = new WebSocketService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
