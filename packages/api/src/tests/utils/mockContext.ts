// Libraries
import { PubSub } from 'graphql-yoga';

// Dependencies
import { redis } from '@root/redis';
import { Beast } from '@root/types';

// TODO: Create typescript-utils package with these helpful types.
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// Or, to omit multiple properties:
type Context = Omit<Beast.IContext, 'request'|'response'|'database'|'loaders'|'connection'|'fragmentReplacements'>; // Equivalent to: {c: boolean}

interface IContext extends Context {
  request: typeof mockRequest
  response: typeof mockResponse
}

const pubsub = new PubSub(); // Subscriptions.

const mockRequest = {
  session: {},
  sessionID: undefined,
  destroy(callback: Function): void {
    mockRequest.session = {};
    mockRequest.sessionID = undefined;
    if (callback && typeof callback === 'function') {
      callback();
    }
  },
};

const mockResponse = {
  req: {
    headers: {
      cookie: undefined,
    },
    clearCookie(key: string): void {
      if (key === 'qid') {
        mockResponse.req.headers.cookie = undefined;
      }
    },
  },
}

const mockedContext: IContext = {
  request: mockRequest,
  response: mockResponse,
  pubsub,
  redis,
}

interface ISingletonMockedContext {
  context: IContext
  connect(): Promise<boolean>
  disconnect(): Promise<boolean>
}

class SingletonMockedContext implements ISingletonMockedContext {
  private static instance: SingletonMockedContext; // SingletonMockedContext instance.

  /**
   * If get instance has not been initialized then it will construct a new SingletonMockedContext class object,
   * then store it into the instance property. If it has already been created then it will simply
   * return the instance property.
   * This assures that there will only ever be one instance.
   */
  static getInstance(): SingletonMockedContext {
    if (!SingletonMockedContext.instance) {
      SingletonMockedContext.instance = new SingletonMockedContext(mockedContext);
    }
    return SingletonMockedContext.instance;
  }

  private isConnected: boolean; // isConnected bool.

  public context: IContext; // Member variable that will store the SingletonMockedContext instance.

  /**
   * Read only property that can not be modified nor accessed outside of the class.
   */
  private constructor(public readonly ctx: IContext) {
    this.context = ctx;
    this.isConnected = true;
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  public async connect(): Promise<boolean> {
    if (!this.isConnected) {
      this.isConnected = !this.isConnected;
      await Promise.all([
        SingletonMockedContext.instance.context.redis.connect(),
      ]);
    }
    return this.isConnected;
  }

  public async disconnect(): Promise<boolean> {
    if (this.isConnected) {
      this.isConnected = !this.isConnected;
      await Promise.all([
        SingletonMockedContext.instance.context.redis.disconnect(),
      ]);
    }
    return this.isConnected;
  }
}

export const { context, connect, disconnect } = SingletonMockedContext.getInstance();
