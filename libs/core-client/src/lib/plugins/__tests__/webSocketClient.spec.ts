import mezzoClient from '../../core-client';
import {
  startServer,
  waitForSocketState,
} from '../../__tests__/utils/webSocketTestUtils';
import WebSocket from 'ws';
import { IClientOptions } from '@caribou-crew/mezzo-interfaces';
import { send } from 'process';
// import { corePort } from './testPorts';

const DEFAULT_DELAY = 50;

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Test websocket client
 * This is heavily based on timeouts so that client & server can communicate (hosted locally) or disconnect.  TODO make this deterministic
 */
describe('webSocketClient', () => {
  let client: ReturnType<typeof mezzoClient>;
  let server;
  let messages = [];
  const waitForMessageLength = (targetLength: number) => {
    return new Promise(function (resolve) {
      setTimeout(function () {
        if (messages.length === targetLength) {
          resolve('');
        } else {
          waitForMessageLength(targetLength).then(resolve);
        }
      }, 5);
    });
  };
  const createSocket = (path) => {
    return new WebSocket(path);
  };

  const port = 3020 + Number(process.env.JEST_WORKER_ID);

  const connectionHelper = async (options: IClientOptions) => {
    client = mezzoClient(options);
    client.connect();
    await waitForSocketState(client, WebSocket.OPEN);
  };

  beforeAll(async () => {
    // global.console = require('console'); // Don't stack trace out all console logs
    // process.env.LOG_LEVEL = 'warn';

    // Provide node websocket implementation to client for unit testing (as opposed to what is in browser or React Native)
    Object.assign(global, { WebSocket: require('ws') });

    // Start echo socket server - it simply replies to the client what client says
    server = await startServer(port);
  });
  beforeEach(() => {
    messages = [];
  });
  afterEach(async () => {
    client.close();
    await timeout(DEFAULT_DELAY);
  });
  afterAll(() => server.close());

  describe('.connect', () => {
    it('should connect you to server and send intro message', async () => {
      const onCommand = (data: any) => {
        messages.push(data);
      };
      connectionHelper({
        createSocket,
        port,
        onCommand,
      });

      await waitForMessageLength(1); // Wait for connection message
      expect(messages).toHaveLength(1);

      const clientConnection = messages[0];
      expect(clientConnection.type).toBe('client.intro');
      expect(clientConnection.payload.name).toBe('mezzo-core-client');
      expect(clientConnection.payload.clientId).toBe('');
      expect(clientConnection.payload.reactotronCoreClientVersion).toBe(
        'MEZZO_CORE_VERSION'
      );
      expect(clientConnection.important).toBe(false);
      // TODO mock out date and assert ISO format?
      expect(typeof clientConnection.date).toBe('string');
      expect(clientConnection.deltaTime).toBeGreaterThan(0);
    });
  });

  describe('.onDisconnect (onClose)', () => {
    it('should call user defined onDisconnect function on disconnect', async () => {
      let disconnected = false;
      await connectionHelper({
        createSocket,
        port,
        onDisconnect: () => {
          disconnected = true;
        },
      });

      client.close();
      await timeout(DEFAULT_DELAY);
      expect(disconnected).toBe(true);
    });
  });

  describe('.onMessage', () => {
    it('should call user defined `onCommand`', async () => {
      const onCommand = jest.fn();
      await connectionHelper({
        createSocket,
        port,
        onCommand,
      });
      await timeout(DEFAULT_DELAY); // buy time for message to be received
      expect(onCommand).toHaveBeenCalled();
    });
    it('should call `setClientId` on receving a sepcific message', async () => {
      const setClientId = jest.fn();
      await connectionHelper({
        createSocket,
        port,
        setClientId,
      });
      client.send('setClientId', 'abcdef');
      await timeout(DEFAULT_DELAY); // buy time for message to be received
      expect(setClientId).toHaveBeenCalled();
    });
    it('should gracefully handle scenarios where `setClientId` is not defined despite receving the message', async () => {
      await connectionHelper({
        createSocket,
        port,
        setClientId: null,
      });
      client.send('setClientId', 'abcdef');
      await timeout(DEFAULT_DELAY); // buy time for message to be received
    });
    /**
     * client sends ping, server echos back, on ping message from server client should send pong, server echos back, clinet verifies it recieved a pong asserting clinet had sent it had sent it in response to ping
     */
    it('should reply with `pong` if server sends `ping` heartbeat ', async () => {
      let receivedPing = false;
      const onCommand = (data: any) => {
        if (data?.type === 'pong') {
          receivedPing = true;
        }
      };
      await connectionHelper({
        onCommand,
        createSocket,
        port,
      });
      client.send('ping');
      await timeout(DEFAULT_DELAY); // buy time for message to be received
      expect(receivedPing).toBe(true);
    });
  });

  describe('.send', () => {
    it('should queue up messages when not connected', async () => {
      client = mezzoClient({
        onCommand: (data) => {
          messages.push(data);
        },
        createSocket,
        port,
      });

      client.send('preConnect', 'first message');
      client.send('preConnect', 'second message');

      await timeout(50); // just to prove nothing is pending/needing time

      expect(messages).toHaveLength(0);

      client.connect();
      await waitForSocketState(client, WebSocket.OPEN);

      await waitForMessageLength(3);
      expect(messages[1].payload).toEqual('first message');
      expect(messages[2].payload).toEqual('second message');
    });
  });
  describe('.captureApiRequest', () => {
    it('should send request socket message', async () => {
      await connectionHelper({
        onCommand: (data) => {
          messages.push(data);
        },
        createSocket,
        port,
      });
      client.captureApiRequest('someMethod', 'someUrl');
      await waitForMessageLength(2);
      expect(messages[1].type).toBe('api.request');
      expect(messages[1].payload.method).toBe('someMethod');
      expect(messages[1].payload.url).toBe('someUrl');
      expect(messages[1].payload.guid).toBeDefined();
      expect(messages[1].important).toBe(false);
      expect(messages[1].deltaTime).toBeDefined();
      expect(messages[1].date).toBeDefined();
    });
  });

  describe('.captureApiResponse', () => {
    it('should send response socket message', async () => {
      await connectionHelper({
        onCommand: (data) => {
          messages.push(data);
        },
        createSocket,
        port,
      });
      // client.captureApiResponse(null, null, 123, 'abcd');
      client.captureApiResponse(
        {
          url: 'someUrl',
          method: 'someMethod',
          data: null,
          headers: null,
          params: null,
        },
        { status: 200, body: null, headers: null },
        123,
        'abcd'
      );
      await waitForMessageLength(2);
      expect(messages[1].type).toBe('api.response');
      expect(messages[1].payload.duration).toBeDefined();
      expect(messages[1].payload.request).toBeDefined();
      expect(messages[1].payload.response).toBeDefined();
      expect(messages[1].important).toBe(false);
      expect(messages[1].deltaTime).toBeDefined();
      expect(messages[1].date).toBeDefined();
    });
    it('should treat non 2xx as impotant', async () => {
      await connectionHelper({
        onCommand: (data) => {
          messages.push(data);
        },
        createSocket,
        port,
      });
      client.captureApiResponse(
        {
          url: 'someUrl',
          method: 'someMethod',
          data: null,
          headers: null,
          params: null,
        },
        { status: 404, body: null, headers: null },
        123,
        'abcd'
      );
      await waitForMessageLength(2);
      expect(messages[1].important).toBe(true);
    });
    it('should gracefully handle null request and response', async () => {
      await connectionHelper({
        onCommand: (data) => {
          messages.push(data);
        },
        createSocket,
        port,
      });
      client.captureApiResponse(null, null, 123, 'abcd');
      await waitForMessageLength(2);
      expect(messages[1].important).toBe(true);
    });
  });
});
