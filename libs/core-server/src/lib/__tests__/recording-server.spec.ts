import { MEZZO_API_GET_RECORDINGS } from '@caribou-crew/mezzo-constants';
import * as SuperTestRequest from 'supertest';
import mezzo from '../core';
import { recordingServerPort } from './testPorts';
import logger from '@caribou-crew/mezzo-utils-logger';

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
describe('recordingServer', () => {
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;
  // const port = recordingServerPort + Jes;
  const port = recordingServerPort + Number(process.env.JEST_WORKER_ID);
  beforeAll(() => {
    global.console = require('console'); // Don't stack trace out all console logs
    logger.info('Using port: ', port);
  });

  beforeEach(async () => {
    request = SuperTestRequest(`http://localhost:${port}`);
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
  });
  afterEach(async () => {
    await mezzo.stop();
  });

  // Currently only supported via websocket, not REST
  // describe('record request', () => {
  //   it('should be a post endpoint', async () => {
  //     const url = MEZZO_API_POST_RECORD_REQUEST;

  //     const res = await request.post(url);
  //     expect(res.status).toBe(201);
  //   });
  // });

  // Currently only supported via websocket, not REST
  // describe('record response', () => {
  //   it('should be a post endpoint', async () => {
  //     const url = MEZZO_API_POST_RECORD_RESPONSE;

  //     const res = await request.post(url);
  //     expect(res.status).toBe(201);
  //   });
  // });

  describe('view recordings', () => {
    it('should be a GET endpoint', async () => {
      const url = MEZZO_API_GET_RECORDINGS;

      const res = await request.get(url);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: [] });
    });
  });

  // describe('socket connection', () => {
  //   it('should work', async () => {
  //     const client = new WebSocket(`ws://localhost:${port}`);

  //     let welcomeMessage;
  //     client.on('message', (data) => {
  //       welcomeMessage = data.toString();
  //     });
  //     await waitForSocketState(client, client.OPEN);

  // Probably won't keep welcome message
  //     expect(welcomeMessage).toBe(
  //       'Welcome to the mezzo recording socket server'
  //     );
  //     client.close();
  //   });
  // });

  // TODO move interceptor-fetch to that lib, shouldn't be in core
  // describe('functionality', () => {
  //   it.skip('mock fetch for testing', async () => {
  //     const fetchWithIntercept = interceptedFetch(fetch, { port });
  //     const response = await fetchWithIntercept(
  //       `http://localhost:${port}/movies`
  //     );

  //     // Assert fetch still works as expected
  //     const json = await response.json();
  //     expect(json).toEqual(movies);

  //     // Assert local recording API has processed the request and response
  //     const response2 = await request.get(MEZZO_API_GET_RECORDINGS);
  //     console.log('Recordings: ', response2.body.responses);
  //     expect(response2.status).toBe(200);
  //     // expect(response2.body.responses).toHaveLength(2);
  //     // expect(response2.body.requests).toHaveLength(1);
  //   });
  // });
});
