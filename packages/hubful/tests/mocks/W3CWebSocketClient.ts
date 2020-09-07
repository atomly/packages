// Libraries
import faker from 'faker';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

export class W3CWebSocketClient extends W3CWebSocket {
  public id: string;
  public onErrorCallback: jest.MockedFunction<(...args: unknown[]) => unknown>;
  public onOpenCallback: jest.MockedFunction<(...args: unknown[]) => unknown>;
  public onCloseCallback: jest.MockedFunction<(...args: unknown[]) => unknown>;
  public onMessageCallback: jest.MockedFunction<(...args: unknown[]) => unknown>;

  constructor(args: {
    wsHost: string,
    echoProtocol: string,
  }) {
    super(args.wsHost, args.echoProtocol);

    this.id = faker.random.uuid();

    this.onErrorCallback = jest.fn();
    this.onOpenCallback = jest.fn();
    this.onCloseCallback = jest.fn();
    this.onMessageCallback = jest.fn();

    this.onerror = function(): void {
      console.log(`[${this.id}] SocketClient - [onerror] Connection Error`);
      this.onErrorCallback();
    };
    
    this.onopen = function(): void {
      console.log(`[${this.id}] SocketClient - [onopen] WebSocket Client Connected`);
      this.onOpenCallback();
    };
    
    this.onclose = function(): void {
      console.log(`[${this.id}] SocketClient - [onclose] echo-protocol Client Closed`);
      this.onCloseCallback();
    };
    
    this.onmessage = function(event): void {
      console.log(`[${this.id}] SocketClient - [onmessage] event.data`, event.data);
      this.onMessageCallback(event);
    };
  }

  public mockClear(): void {
    this.onErrorCallback.mockClear();
    this.onOpenCallback.mockClear();
    this.onCloseCallback.mockClear();
    this.onMessageCallback.mockClear();
  }
}
