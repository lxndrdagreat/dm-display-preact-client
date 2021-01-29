import type { SocketMessage } from './socket-message-type.schema';
import type {SocketMessageType} from './socket-message-type.schema';

type OnSocketMessageSubscriber = (message: SocketMessage) => void;
type UnsubscribeFunction = () => void;

export class SocketClient {
  private static _instance: SocketClient;
  private socket: WebSocket | null = null;
  private onSocketMessageSubscribers: OnSocketMessageSubscriber[] = [];
  private nextOfTypeCallbacks: Record<number, OnSocketMessageSubscriber[]> = {};

  static get instance(): SocketClient {
    if (!SocketClient._instance) {
      SocketClient._instance = new SocketClient();
    }
    return SocketClient._instance;
  }

  connect(): void {
    if (this.socket) {
      throw new Error('Cannot connect: already have socket connection.');
    }

    const protocol = 'wss'; // location.protocol.startsWith('https') ? 'wss' : 'ws';
    this.socket = new WebSocket(`${protocol}://localhost:3090`);
    // this.socket.binaryType = 'arraybuffer';
    this.socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as SocketMessage;
      for (const sub of this.onSocketMessageSubscribers) {
        sub(data);
      }
      // check nextOfType callbacks
      if (this.nextOfTypeCallbacks[data.type]) {
        for (const callback of this.nextOfTypeCallbacks[data.type]) {
          callback(data);
        }
        this.nextOfTypeCallbacks[data.type] = [];
      }
    };

    this.socket.onclose = () => {
      console.log('socket closed');
      this.socket = null;
    };
  }

  subscribe(sub: OnSocketMessageSubscriber): UnsubscribeFunction {
    this.onSocketMessageSubscribers.push(sub);
    return () => {
      this.onSocketMessageSubscribers.splice(this.onSocketMessageSubscribers.indexOf(sub), 1);
    };
  }

  send(message: SocketMessage): SocketClient {
    if (!this.socket) {
      throw new Error('Cannot send: no socket connection.');
    }
    this.socket.send(JSON.stringify(message));

    return this;
  }

  // FIXME: not convinced that this is a healthy way to accomplish this
  nextOfType(messageType: SocketMessageType, callback: OnSocketMessageSubscriber): SocketClient {
    if (!this.nextOfTypeCallbacks[messageType]) {
      this.nextOfTypeCallbacks[messageType] = [];
    }
    this.nextOfTypeCallbacks[messageType].push(callback);

    return this;
  }
}
