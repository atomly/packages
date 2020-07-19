// Libraries
import { ServerOptions } from 'socket.io';

// Types
import { ISocketsService } from '../SocketsService';

export interface ISocketIOSocketsServiceParams extends ServerOptions {
  /**
   * The port that we want to attach to.
   */
  port: number
}

export interface ISocketIOSocketsService extends ISocketsService {
  /**
   * SocketIO implementation of the SocketsService parameters.
   */
  _params: ISocketIOSocketsServiceParams;
}
