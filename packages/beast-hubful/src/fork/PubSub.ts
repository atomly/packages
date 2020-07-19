/**
 * TODO: Make each handler a function to mimic Hooks.
 * [Forked from apollographql](https://github.com/apollographql/graphql-subscriptions/blob/master/src/pubsub-engine.ts)
 */
import { EventEmitter } from 'events';

// export abstract class IPubSub {
//   public abstract publish(triggerName: string, payload: any): Promise<void>;
//   public abstract subscribe(triggerName: string, onMessage: Function, options: Object): Promise<number>;
//   public abstract unsubscribe(subId: number);
//   public asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>
// }

export interface PubSubOptions {
  eventEmitter?: EventEmitter;
}

export abstract class PubSub {
  protected ee: EventEmitter;
  private subscriptions: { [key: string]: [string, (...args: unknown[]) => void] };
  private subIdCounter: number;

  constructor(options: PubSubOptions = {}) {
    this.ee = options.eventEmitter ?? new EventEmitter();
    this.subscriptions = {};
    this.subIdCounter = 0;
  }

  public publish(triggerName: string, payload: unknown): Promise<void> {
    this.ee.emit(triggerName, payload);
    return Promise.resolve();
  }

  public subscribe(triggerName: string, onMessage: (...args: unknown[]) => void): Promise<number> {
    this.ee.addListener(triggerName, onMessage);
    this.subIdCounter = this.subIdCounter + 1;
    this.subscriptions[this.subIdCounter] = [triggerName, onMessage];

    return Promise.resolve(this.subIdCounter);
  }

  public unsubscribe(subId: number): void {
    const [triggerName, onMessage] = this.subscriptions[subId];
    delete this.subscriptions[subId];
    this.ee.removeListener(triggerName, onMessage);
  }
}
