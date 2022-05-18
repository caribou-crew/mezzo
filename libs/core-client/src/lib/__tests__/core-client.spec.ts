import mezzoClient from '../core-client';
import WebSocket from 'ws';
import { startServer, waitForSocketState } from './utils/webSocketTestUtils';

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createSocket = (path) => {
  return new WebSocket(path);
};
const port = 3000 + Number(process.env.JEST_WORKER_ID);

describe('coreClient sockets', () => {
  let server;
  let client: ReturnType<typeof mezzoClient>;

  beforeAll(async () => {
    global.console = require('console'); // Don't stack trace out all console logs
    // setLogLevel('debug');
    server = await startServer(port);
  });

  afterAll(() => server.close());

  test.skip('Server echoes the message it receives from client', async () => {
    const messages = [];

    // onMessage callback for client
    const onCommand = (data: any) => {
      // logger.info('In custom on response', data);
      messages.push(data);
      if (messages.length >= 2) {
        client.close();
      }
    };

    // Initialize and connect clinet
    // client = new MezzoClient({
    client = mezzoClient({
      createSocket,
      port,
      onCommand,
    });
    client.connect();
    // client = mezzoClient.recordingClient;
    await waitForSocketState(client, WebSocket.OPEN);

    // logger.info('--Done watiting for socket state');

    // TODO find more deterministic way to accomplish this
    await timeout(20);
    expect(messages).toHaveLength(1);

    client.send('someType', { message: 'hello' }, false);

    // TODO find more deterministic way to accomplish this
    await timeout(20);
    expect(messages).toHaveLength(2);

    // TODO understand why sockets are still in binary/buffer format unless JSON.parse or .toString() is called on them
    const responseObject = JSON.parse(messages[1]);
    // logger.info(responseObject);
    expect(responseObject?.payload?.message).toBe('hello');
  });
});
