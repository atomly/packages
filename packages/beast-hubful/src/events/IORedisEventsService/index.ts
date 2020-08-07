// Libraries
import IORedis, { Redis } from 'ioredis';
import { v4 } from 'uuid';

// Types
import { TEventHandler, IEventsServiceOptions } from '../EventsService';
import { IIORedisEventsService, IIORedisEventsServiceArgs } from './types';

export class IORedisEventsService implements IIORedisEventsService {
  public _eventsMap: IIORedisEventsService['_eventsMap']
  public _handlersMap: IIORedisEventsService['_handlersMap']
  public _ioPublisherRedis: IIORedisEventsService['_ioPublisherRedis']
  public _ioSubscriberRedis: IIORedisEventsService['_ioSubscriberRedis']

  constructor(args: IIORedisEventsServiceArgs) {
    this._eventsMap = new Map<string, TEventHandler[]>();
    this._handlersMap = new Map<string, { event: string, handler: TEventHandler, index: number, options?: IEventsServiceOptions }>();
    this._ioSubscriberRedis = this.setupIORedisInstance(args);
    this._ioPublisherRedis = this.setupIORedisInstance(args);
    // Bindings:
    this.onMessage = this.onMessage.bind(this);
  }

  public async start(): Promise<void> {
    this._ioSubscriberRedis.on('pmessage', this.onMessage);
    this._ioSubscriberRedis.on('message', this.onMessage);
  }

  /**
   * Handles incoming regular events (`message`) and pattern (`pmessage`)
   * events. Whenever an event is triggered, ALL of the handlers related to
   * the event will be executed and will receive the respective event
   * and payload.
   * @param event - The triggered event that handlers are subscribed to.
   * @param payload - A payload that will be sent to the subscribed handlers.
   */
  private async onMessage(event: string, payload: string): Promise<void> {
    // If a payload was published but there are no active subscriptions, 
    // simply return.
    if (!this._handlersMap.size || !this._eventsMap.size) { return; }
    // Otherwise, execute all handlers of the payload's event:
    const handlers = this._eventsMap.get(event);
    if (handlers) {
      const eventHandlers = handlers.map(handler => handler(event, payload));
      await Promise.all(eventHandlers);
    } else {
      throw new Error(`Handler for event [${event}] not found.`);
    }
  }

  public async on(event: string, handler: TEventHandler, options?: IEventsServiceOptions): Promise<string> {
    const subscriptionId = v4();
    const handlers = this._eventsMap.get(event);
    // Check if the event has already been created. If it was already created,
    // then simply push the new handler into its respective event to handlers map,
    // and store it in the handlers map.
    if (handlers) {
      handlers.push(handler);
      this._handlersMap.set(subscriptionId, { handler, event, options });
    // Otherwise, create the event to handlers map, then store the handler information in
    // the handlers map. Finally, subscribe to the event.
    } else {
      this._eventsMap.set(event, [handler]);
      this._handlersMap.set(subscriptionId, { handler, event, options });
      if (options?.pattern) {
        await this._ioSubscriberRedis.psubscribe(event);
      } else {
        await this._ioSubscriberRedis.subscribe(event);
      }
    }
    return subscriptionId;
  }

  public async remove(subscriptionId: string): Promise<boolean> {
    const handlerData = this._handlersMap.get(subscriptionId);
    if (handlerData) {
      // Find the respective handlers array from the eventsMap:
      const handlers = this._eventsMap.get(handlerData.event)!;
      // If the handlers array only holds 1 handler, unsubscribe from the topic,
      // and then delete the event from the eventsMap:
      if (handlers.length === 1) {
        await Promise.all([
          this._ioSubscriberRedis.unsubscribe(handlerData.event),
          this._ioSubscriberRedis.punsubscribe(handlerData.event),
        ]);
        this._eventsMap.delete(handlerData.event);
      }
      // Otherwise, remove the handler from the handlers array:
      else {
        const index = handlers.indexOf(handlerData.handler);
        handlers.splice(index, 1);
      }
      // Finally delete the respective handlersMap value and return true:
      this._handlersMap.delete(subscriptionId);
      return true;
    }
    return false;
  }

  public async removeAll(event?: string): Promise<boolean> {
    try {
      if (event) {
        // Unsubscribe the Redis client from this event:
        await Promise.all([
          this._ioSubscriberRedis.unsubscribe(event),
          this._ioSubscriberRedis.punsubscribe(event),
        ]);
        // Clear the respetive handlers and event from the maps:
        const subscriptionIdsToRemove: string[] = [];
        this._handlersMap.forEach((handlersData, key) => {
          if (handlersData.event === event) { subscriptionIdsToRemove.push(key); }
        });
        subscriptionIdsToRemove.forEach(subscriptionId => {
          this._handlersMap.delete(subscriptionId);
        });
        this._eventsMap.delete(event);
        return true;
      } else {
        // Unsubscribe the Redis client from all events:
        const events = this._eventsMap.keys();
        const unsubscribePromises = [];
        for (const event of events) {
          unsubscribePromises.push(this._ioSubscriberRedis.unsubscribe(event));
          unsubscribePromises.push(this._ioSubscriberRedis.punsubscribe(event));
        }
        await Promise.all(unsubscribePromises);
        // Clear all of the maps:
        this._handlersMap.clear();
        this._eventsMap.clear();
        return true;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      return false;
    }
  }

  public async close(callback?: (...args: unknown[]) => Promise<void> | void): Promise<void> {
    await this.removeAll();
    await Promise.all([
      this._ioSubscriberRedis.quit(),
      this._ioPublisherRedis.quit(),
    ])
    if (callback) { await callback(); }
  }

  public async emit(event: string, payload: string): Promise<void> {
    await this._ioPublisherRedis.publish(event, payload);
  }

  /**
   * Returns an internal instance of io.redis.
   */
  private setupIORedisInstance(args: IIORedisEventsServiceArgs): Redis {
    // Setting up Redis client:
    if (Array.isArray(args.nodes)) {
      return new IORedis({
        sentinels: args.nodes,
        name: args.name,
        family: args.family,
        password: args.password,
        db: args.db,
      });
    } else  {
      return new IORedis({
        port: args.nodes.port,
        host: args.nodes.host,
        name: args.name,
        family: args.family, // 4 (IPv4) or 6 (IPv6)
        password: args.password,
        db: args.db,
      });
    }
  }
}
