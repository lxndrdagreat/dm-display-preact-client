import type { SocketMessage } from './socket-message-type.schema';
import { SocketMessageType } from './socket-message-type.schema';
import { serverHostURL } from '../app.globals';

type OnSocketMessageSubscriber = (message: SocketMessage) => void;
type UnsubscribeFunction = () => void;
type OnSocketConnectionClosedSubscriber = () => void;
type OnSocketConnectionOpenedSubscriber = () => void;

export class SocketClient {
  private static _instance: SocketClient;
  private socket: WebSocket | null = null;
  private onSocketMessageSubscribers: OnSocketMessageSubscriber[] = [];
  private onSocketConnectionClosedSubscribers: OnSocketConnectionClosedSubscriber[] = [];
  private onSocketConnectionOpenedSubscribers: OnSocketConnectionOpenedSubscriber[] = [];
  private nextOfTypeCallbacks: Record<number, OnSocketMessageSubscriber[]> = {};
  private lastMessageTime: number = performance.now();
  private heartbeatInterval: number | null = null;

  static get instance(): SocketClient {
    if (!SocketClient._instance) {
      SocketClient._instance = new SocketClient();
    }
    return SocketClient._instance;
  }

  async connect(): Promise<void> {
    if (this.socket) {
      throw new Error('Cannot connect: already have socket connection.');
    }

    return new Promise((resolve) => {
      this.socket = new WebSocket(serverHostURL);
      // this.socket.binaryType = 'arraybuffer';

      this.socket.onmessage = (event: MessageEvent) => {
        this.lastMessageTime = performance.now();
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

      this.socket.onopen = () => {
        for (const sub of this.onSocketConnectionOpenedSubscribers) {
          sub();
        }

        this.heartbeatInterval = window.setInterval(() => {
          this.heartbeat();
        }, 30000);

        resolve();
      };

      this.socket.onclose = () => {
        this.socket = null;
        for (const sub of this.onSocketConnectionClosedSubscribers) {
          sub();
        }
        if (this.heartbeatInterval !== null) {
          window.clearInterval(this.heartbeatInterval);
        }
      };
    });
  }

  private heartbeat() {
    if (!this.socket) {
      return;
    }
    // 45 seconds
    const now = performance.now();
    if (now - this.lastMessageTime >= 45000) {
      this.lastMessageTime = now;
      // send heartbeat
      this.send({
        type: SocketMessageType.Heartbeat
      });
    }
  }

  close(): void {
    if (!this.socket) {
      return;
    }
    this.socket.close();
  }

  get connected(): boolean {
    return this.socket !== null;
  }

  subscribe(sub: OnSocketMessageSubscriber): UnsubscribeFunction {
    this.onSocketMessageSubscribers.push(sub);
    return () => {
      this.onSocketMessageSubscribers.splice(
        this.onSocketMessageSubscribers.indexOf(sub),
        1
      );
    };
  }

  onClose(sub: OnSocketConnectionClosedSubscriber): UnsubscribeFunction {
    this.onSocketConnectionClosedSubscribers.push(sub);
    return () => {
      this.onSocketConnectionClosedSubscribers.splice(
        this.onSocketConnectionClosedSubscribers.indexOf(sub),
        1
      );
    };
  }

  onOpen(sub: OnSocketConnectionOpenedSubscriber): UnsubscribeFunction {
    this.onSocketConnectionOpenedSubscribers.push(sub);
    return () => {
      this.onSocketConnectionOpenedSubscribers.splice(
        this.onSocketConnectionOpenedSubscribers.indexOf(sub),
        1
      );
    };
  }

  send(message: SocketMessage): SocketClient {
    if (!this.socket) {
      throw new Error('Cannot send: no socket connection.');
    }
    this.socket.send(JSON.stringify(message));
    this.lastMessageTime = performance.now();
    return this;
  }

  // FIXME: not convinced that this is a healthy way to accomplish this
  nextOfType(
    messageType: SocketMessageType,
    callback: OnSocketMessageSubscriber
  ): SocketClient {
    if (!this.nextOfTypeCallbacks[messageType]) {
      this.nextOfTypeCallbacks[messageType] = [];
    }
    this.nextOfTypeCallbacks[messageType].push(callback);

    return this;
  }

  static async testServerExists(): Promise<boolean> {
    const client = new SocketClient();
    try {
      await client.connect();
      client.close();
      return true;
    } catch (e) {
      return false;
    }
  }
}
