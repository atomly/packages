// Libraries
import axios, { AxiosResponse } from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import faker from 'faker';
import { createServer } from 'http';
import { server as WebSocketServer } from 'websocket';

// Test Utils
import { setupHubfulInstance, wait } from '../utils';

// Mocks
import { W3CWebSocketClient } from '../mocks';

// Dependencies
import Hubful, { usePublish, useSubscribe, useShutdown, EHubfulServiceStatus, useUnsubscribe } from '../../src';

// Spys

const spyUsePublish = jest.fn(usePublish);

// Constants

const WAIT_TIMER = 50;
const MESSAGE_TOPIC = 'MESSAGE_TOPIC';
const PORT = 8686;
const HOST = `localhost:${PORT}`;
const HTTP_HOST = `http://${HOST}`;
const WS_HOST = `ws://${HOST}`;
const app = express();
const server = createServer(app);

const seededMessage: IMessage = {
  id: faker.random.uuid(),
  user: faker.internet.userName(),
  message: faker.random.words(),
}

const collections = {
  messages: new Map<string, IMessage>(),
};

collections.messages.set(seededMessage.id, seededMessage);

// Setting up Server:

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false,
});

wsServer.on('request', async function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  
  const connection = request.accept('echo-protocol', request.origin);

  console.log((new Date()) + ' Connection accepted.');

  // Hubful subscription:
  const subscriptionId = await useSubscribe(MESSAGE_TOPIC, async (topic, payload) => {
    console.log('[onTopicHandler] topic: ', topic);
    console.log('[onTopicHandler] payload: ', payload);
    connection.send(JSON.stringify(payload));
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connection.on('close', async function(reasonCode, description) {
    await useUnsubscribe(subscriptionId);
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function originIsAllowed(origin: string): boolean {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

async function setupApp(): Promise<void> {
  // Middlewares
  app.use(bodyParser.json());

  // Routes
  app.get('/message', async (_, res) => {
    res.json(Array.from(collections.messages.values()));
  });

  app.get('/message/:id', async (req, res) => {
    res.json(collections.messages.get(req.params.id));
  });

  app.post('/message', async (req, res) => {
    const payload: IPostMessagePayload = req.body;
    const messageEntity = {
      id: faker.random.uuid(),
      user: payload.user,
      message: payload.message,
    };
    collections.messages.set(messageEntity.id, messageEntity);
    await spyUsePublish(MESSAGE_TOPIC, messageEntity);
    res.json(messageEntity);
  });
}

// Setting up WebSocket Clients:

const clientOne = new W3CWebSocketClient({ wsHost: WS_HOST, echoProtocol: 'echo-protocol' });
const clientTwo = new W3CWebSocketClient({ wsHost: WS_HOST, echoProtocol: 'echo-protocol' });

// Tests:

describe('correctly integrates with express', () => {
  beforeAll(
    async () => {
      // Setting up Hubful, Express app, and the Server:
      await setupHubfulInstance();
      await setupApp();
      await new Promise(resolve => {
        server.listen(PORT, () => {
          console.log(`Listening on ${HTTP_HOST} and ${WS_HOST}`);
          resolve();
        });
      });
    },
    120000,
  );

  afterAll(
    async () => {
      // Shutting down Hubful:
      await useShutdown();
      // Shutting down WebSocketServer and waiting for events:
      wsServer.unmount();
      wsServer.closeAllConnections();
      await wait(WAIT_TIMER);
      // Shutting down server:
      await new Promise((resolve, reject) => {
        server.close(err => {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(`Closing ${HTTP_HOST} and ${WS_HOST}`);
          resolve();
        });
      });
    },
    120000,
  );

  // Clear mocks:
  afterEach(() => {
    clientOne.mockClear();
    clientTwo.mockClear();
    spyUsePublish.mockClear();
  });

  const axiosInstance = axios.create({ baseURL: HTTP_HOST });

  test('hubful instance is connected', () => {
    expect(Hubful.status).toBe(EHubfulServiceStatus.CONNECTED);
  })

  test('express mock app should work correctly', async () => {
    let result: AxiosResponse;
    result = await axiosInstance.get(`/message`);
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe(seededMessage.id);
    result = await axiosInstance.get(`/message/${result.data[0].id}`);
    expect(result.data).toMatchObject(seededMessage);
  });

  test(`a message is posted and both clients receive a payload through topic ${MESSAGE_TOPIC}`, async () => {
    const message = {
      user: faker.internet.userName(),
      message: faker.random.words(),
    };
    // Creating a message that will be published to all subscribed clients:
    const result: AxiosResponse = await axiosInstance.post(`/message`, message);
    expect(result.data).toMatchObject(message);
    // usePublish should be used after a message is posted:
    expect(spyUsePublish.mock.calls).toHaveLength(1);
    await wait(WAIT_TIMER);
    // Assert if clients received the messages:
    expect(clientOne.onMessageCallback.mock.calls).toHaveLength(1);
    expect(clientTwo.onMessageCallback.mock.calls).toHaveLength(1);
  });

  test(`after closing client one, only client two receives a message through topic ${MESSAGE_TOPIC}`, async () => {
    const message = {
      user: faker.internet.userName(),
      message: faker.random.words(),
    };
    // Closing client one:
    clientOne.close();
    await wait(WAIT_TIMER);
    // Creating a message that will be published to all subscribed clients:
    const result: AxiosResponse = await axiosInstance.post(`/message`, message);
    expect(result.data).toMatchObject(message);
    await wait(WAIT_TIMER);
    // Assert if only client two received the message:
    expect(clientOne.onMessageCallback.mock.calls).toHaveLength(0);
    expect(clientTwo.onMessageCallback.mock.calls).toHaveLength(1);
  });
});

// Types

interface IPostMessagePayload {
  user: string
  message: string
}

interface IMessage extends IPostMessagePayload {
  id: string
}
