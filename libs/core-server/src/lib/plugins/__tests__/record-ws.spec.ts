import mezzo from '../../core';
import { recordingWSPort } from '@mezzo/core-client-server-tests';
import SuperTestRequest from 'supertest';
import logger from '@caribou-crew/mezzo-utils-logger';
import { WebSocket } from 'ws';
// import { webSocketClient } from '@caribou-crew/mezzo-core-client';
import mezzoClient from '@caribou-crew/mezzo-core-client';
import { IClientOptions } from '@caribou-crew/mezzo-interfaces';
import { MEZZO_API_GET_RECORDING_CLIENTS } from '@caribou-crew/mezzo-constants';
const movies = [
  {
    Title: 'Avatar',
    Year: '2009',
    Rated: 'PG-13',
    Released: '18 Dec 2009',
    Runtime: '162 min',
    Genre: 'Action, Adventure, Fantasy',
    Director: 'James Cameron',
  },
  {
    Title: 'I Am Legend',
    Year: '2007',
    Rated: 'PG-13',
    Released: '14 Dec 2007',
    Runtime: '101 min',
    Genre: 'Drama, Horror, Sci-Fi',
    Director: 'Francis Lawrence',
  },
];

// ================
// Helper functions
// ================
const DEFAULT_DELAY = 50;
function waitForSocketState(
  client: ReturnType<typeof mezzoClient>,
  targetState: number
) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (client.getReadyState() === targetState) {
        resolve('');
      } else {
        waitForSocketState(client, targetState).then(resolve);
      }
    }, 5);
  });
}

const createSocket = (path) => {
  return new WebSocket(path);
};
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('recordingServer', () => {
  const port = recordingWSPort + Number(process.env.JEST_WORKER_ID);
  // let ws: WebSocket;
  let client: ReturnType<typeof mezzoClient>;
  let messages = [];
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;

  const connectionHelper = async (options: IClientOptions) => {
    client = mezzoClient(options);
    client.connect();
    await waitForSocketState(client, WebSocket.OPEN);
  };
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

  beforeAll(() => {
    // Provide node websocket implementation to client for unit testing (as opposed to what is in browser or React Native)
    Object.assign(global, { WebSocket: require('ws') });
    // global.console = require('console'); // Don't stack trace out all console logs
  });

  beforeEach(async () => {
    request = SuperTestRequest(`http://localhost:${port}`);
    messages = [];
    await mezzo.start({
      port,
    });

    mezzo.route({
      id: 'GET movies',
      path: '/movies',
      callback: function (req, res) {
        res.json(movies);
      },
    });
    // ws = new WebSocket(`ws:localhost:${port}`);
  });
  afterEach(async () => {
    // ws.close();
    client?.close();
    await mezzo.stop();
    await timeout(DEFAULT_DELAY);
  });

  it('client sending response capture should receive api.response type message', async () => {
    await connectionHelper({
      onCommand: (data) => {
        console.log('Got message: ', data);
        if (data.type !== 'ping') {
          messages.push(data);
        }
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

    await waitForMessageLength(1);
    expect(messages[0].type).toBe('api.response');
  });
  it('other clients should also receive any api.response type message', async () => {
    const client2Messages = [];

    // Client 1
    await connectionHelper({
      onCommand: (data) => {
        console.log('Clinet 1 Got message: ', data);
        if (data.type !== 'ping') {
          messages.push(data);
        }
      },
      createSocket,
      port,
    });

    // Client 2
    const otherClient = mezzoClient({
      onCommand: (data) => {
        if (data.type !== 'ping') {
          client2Messages.push(data);
        }
      },
      createSocket,
      port,
    });
    otherClient.connect();
    await waitForSocketState(otherClient, WebSocket.OPEN);

    // Client 1 sends
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

    // Client 2 verifies receipt
    const client2WaitForMessageLength = (targetLength: number) => {
      return new Promise(function (resolve) {
        setTimeout(function () {
          if (client2Messages.length === targetLength) {
            resolve('');
          } else {
            client2WaitForMessageLength(targetLength).then(resolve);
          }
        }, 5);
      });
    };
    await client2WaitForMessageLength(1);
    expect(client2Messages[0].type).toBe('api.response');

    otherClient.close();
  });

  it('client disconnect should reduce list of connected clients on server', async () => {
    // Assert 0 connections
    const res = await request.get(MEZZO_API_GET_RECORDING_CLIENTS);
    expect(res.body.clients).toHaveLength(0);

    // Connect to server
    const client2 = mezzoClient({
      createSocket,
      port,
    });
    client2.connect();
    await waitForSocketState(client2, WebSocket.OPEN);

    // Assert 1 connection
    const res2 = await request.get(MEZZO_API_GET_RECORDING_CLIENTS);
    expect(res2.body.clients).toHaveLength(1);

    // Discconect from server
    client2.send('close'); // this is what triggers server to remove client
    await timeout(DEFAULT_DELAY);
    client2.close(); // this only closes client, server doesn't react to it (or know about it? ideally server would just see this)

    // Assert 0 connections
    const res3 = await request.get(MEZZO_API_GET_RECORDING_CLIENTS);
    expect(res3.body.clients).toHaveLength(0);
  });
});
