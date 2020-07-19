import { EventEmitter } from 'events';

export interface ISocketsService {
  /**
   * NodeJS EventEmitter instance.
   * [Documentation](https://nodejs.org/api/events.html#events_class_eventemitter).
   */
  _socket: EventEmitter
  /**
   * Attaches the socket server to a port.
   */
  listen(): Promise<void>
  /**
   * The event fired when a new connection is created.
   * @param event The event being fired: ('connection' and 'connect' are the same events).
   * @param handler A handler that receives the SocketsService instance.
   */
  on(event: 'connect' | 'connection', handler: (socketsService: ISocketsService) => Promise<void>): Promise<void>
  /**
   * Closes the socket server. The callback argument is optional and will be called
   * when all connections are closed.
   */
  close(callback?: () => void): Promise<void>
  /**
   * Emits an event to the passed topic.
   * @param topic The topic that we want to emit, if empty it will send the payload to all topics.
   * @param payload A payload that will be sent to the subscribe handlers.
   */
  emit(topic: string, payload: unknown): Promise<void>
  /**
   * Registers to a new or existing topic and maps the topic handler to the topic identifier.
   * @param topic The topic identifier being registered.
   * @param listener The topic listener executed whenever a publish action with the service happens.
   */
  topic(topic: string, listener: (socketsService: ISocketsService) => Promise<void>): Promise<void>
}
