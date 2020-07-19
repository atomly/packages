// Libraries
import SocketIO, { Server as SocketServer, Socket } from 'socket.io';
import { Server } from 'http';

// Types
import { ISocketIOSocketsService, ISocketIOSocketsServiceParams } from './types';

export class SocketIOSocketsService implements ISocketIOSocketsService {
  public _params: ISocketIOSocketsServiceParams;
  public _server?: Server
  public _io: SocketServer
  public _socket: Socket

  constructor(
    args: {
      server?: Server
    }, 
    params: ISocketIOSocketsServiceParams,
  ) {
    this._params = params;
    this._server = args.server;
    // Storing internal SocketIO instance depending on the parameters
    if (this._server) {
      this._io = SocketIO(this._server, this._params);
    } else {
      this._io = SocketIO();
    }
    // Binding the socket on connection
    this._io.on('connection', socket => {
      this._socket = socket;
    });
  }

  public async listen(): Promise<void> {
    if (this._server) {
      this._server.listen(this._params.port);
    } else {
      this._io.listen(this._params.port);
    }
  }

  public async on(event: 'connect' | 'connection', handler: (socketsService: ISocketIOSocketsService) => Promise<void>): Promise<void> {
    this._io.on(event, () => handler(this));
  }

  public async close(callback?: () => void): Promise<void> {
    this._io.close(callback);
  }

  public async emit(topic: string, payload: unknown): Promise<void> {
    this._io.emit(topic, payload);
  }

  public async topic(topic: string, listener: (socketsService: ISocketIOSocketsService) => Promise<void>): Promise<void> {
    this._socket.on(topic, () => listener(this));
  }
}
