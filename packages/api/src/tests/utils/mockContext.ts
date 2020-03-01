// Libraries
import { PubSub } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';// Libraries

// Dependencies
import { redis } from '@redis/index';

const prisma = new PrismaClient(); // Prisma DB layer.
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

interface IContext {
  request: typeof mockRequest
  response: typeof mockResponse
  prisma: typeof prisma
  pubsub: typeof pubsub
  redis: typeof redis
}

const mockedContext: IContext = {
  request: mockRequest,
  response: mockResponse,
  prisma,
  pubsub,
  redis,
} 

class MockedContext {
  private static instance: MockedContext; // MockedContext instance.
  private isConnected: boolean; // isConnected bool.
  public context: IContext; // Member variable that will store the MockedContext instance.

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
        MockedContext.instance.context.redis.connect(),
        MockedContext.instance.context.prisma.connect(),
      ]);
    }
    return this.isConnected;
  }

  public async disconnect(): Promise<boolean> {
    if (this.isConnected) {
      this.isConnected = !this.isConnected;
      await Promise.all([
        MockedContext.instance.context.redis.disconnect(),
        MockedContext.instance.context.prisma.disconnect(),
      ]);
    }
    return this.isConnected;
  }

  /**
   * If get instance has not been initialized then it will construct a new MockedContext class object,
   * then store it into the instance property. If it has already been created then it will simply
   * return the instance property.
   * This assures that there will only ever be one instance.
   */
  static getInstance(): MockedContext {
    if (!MockedContext.instance) {
      MockedContext.instance = new MockedContext(mockedContext);
    }
    return MockedContext.instance;
  }
}

export const { context, connect, disconnect } = MockedContext.getInstance();
