import { RxStompConfig } from '@stomp/rx-stomp';
import { environment } from './environment';

export const myRxStompConfig: RxStompConfig = {
  brokerURL: environment.WS_ENDPOINT,
  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 200,
};
