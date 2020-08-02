export type TEventHandler = (event: string, payload: string) => Promise<void> | void;

export interface IEventsServiceOptions {
  pattern?: boolean
}

export interface IEventsService {
  /**
   * Map of events and the respective handlers.
   */
  _eventsMap: Map<string, TEventHandler[]>;
  /**
   * Map of IDs to the respective event, handler, index in its respective _eventsMap array, and options.
   */
  _handlersMap: Map<string, { event: string, handler: TEventHandler, options?: IEventsServiceOptions }>;
  /**
   * Starts the event listener.
   */
  start(): Promise<void>
  /**
   * Subscribes a handler to an event.
   * @param event - The event being fired that the handler will subscribe to.
   * @param handler - A handler that receives the event and payload.
   * @param options - Handler options, e.g. event pattern when the handlers are triggered.
   * @returns Subscription ID of the registered handler.
   */
  on(event: string, handler: TEventHandler, options?: IEventsServiceOptions): Promise<string>
  /**
   * Removes a handler from the events and handlers map based on its ID.
   * @param subscriptionId - ID of the registered handler.
   * @returns `true` if the event was removed, `false` if the subscriptionId is invalid.
   */
  remove(subscriptionId: string): Promise<boolean>
  /**
   * Removes all the handlers from the passed event, or all handlers if the event
   * was not passed.
   * @param event The event being fired that the handler will subscribe to.
   * @returns `true` if the handlers were successfully removed, `false` if the event is invalid.
   */
  removeAll(event?: string): Promise<boolean>
  /**
   * Closes the socket server. The callback argument is optional and will be called
   * when all connections are closed.
   */
  close(callback?: (...args: unknown[]) => Promise<void> | void): Promise<void>
  /**
   * Emits an event to the clients subscribed to the event parameter (if any).
   * @param event - The event that we want to emit, if empty it will send the payload to all events.
   * @param payload - A payload that will be sent to the subscribed handlers.
   */
  emit(event: string, payload: string): Promise<void>
}
