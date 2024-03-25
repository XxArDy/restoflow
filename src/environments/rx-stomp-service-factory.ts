import { WebSocketService } from 'src/app/shared/data-access/web-socket.service';
import { myRxStompConfig } from './my-rx-stomp.config';

export function rxStompServiceFactory() {
  const rxStomp = new WebSocketService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
