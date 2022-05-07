import * as WebSocket from 'ws';
import * as express from 'express';
import {
  MEZZO_API_POST_RECORD_REQUEST,
  MEZZO_API_POST_RECORD_RESPONSE,
  MEZZO_API_GET_RECORDINGS,
} from '@caribou-crew/mezzo-constants';
// import { v4 as uuidv4 } from 'uuid';
import {
  RecordedItem,
  SocketRequestResponseMessage,
} from '@caribou-crew/mezzo-interfaces';
import { Mezzo } from '../core';
import logger from '@caribou-crew/mezzo-utils-logger';
import { v4 as uuidv4 } from 'uuid';

// TODO type this object in interfaces so that it can also be used via RecordingScreen.tsx
interface Clients {
  id: number;
  ws: WebSocket;
}
const clients: Clients[] = [];
let id = 0;

const data: RecordedItem[] = [];

function setupAPI(app: express.Express) {
  app.post(MEZZO_API_POST_RECORD_REQUEST, (req, res) => {
    console.log('Got record request ');
    const { uuid, config, resource, startTime } = req.body;
    const item = {
      uuid,
      startTime,
      resource,
      request: {
        config,
      },
      response: undefined,
    };
    // TODO temporarily don't allow REST way to update
    console.warn('REST implementation of recording temporarily disallowed');
    // data.push(item);
    res.sendStatus(201);
    // TODO trigger update to anyone listening on socket
    clients.forEach(({ ws }) => {
      ws.send(JSON.stringify(item));
    });
  });
  app.post(MEZZO_API_POST_RECORD_RESPONSE, (req, res) => {
    const { duration, endTime, url, uuid, ...rest } = req.body;
    const existingIndex = data.findIndex((i) => i.uuid === uuid);
    const updatedItem = {
      ...data[existingIndex],
      duration,
      endTime,
      url,
      response: {
        ...rest,
      },
    };
    console.warn('REST implementation of recording temporarily disallowed');
    // data[existingIndex] = updatedItem;
    res.sendStatus(201);
    // TODO trigger update to anyone listening on socket
    notifyAllClientsJSON(updatedItem);
  });
  app.get(MEZZO_API_GET_RECORDINGS, (req, res) => {
    res.send({
      data,
    });
  });
}

function notifyAllClientsJSON(message: any) {
  clients.forEach(({ ws }) => {
    console.log('Sending message to all connected clients');
    ws.send(JSON.stringify(message));
  });
}

function processRequestResponseMessage(message: SocketRequestResponseMessage) {
  if (message.type != null) {
    const { request, response } = message.payload;
    const item: RecordedItem = {
      uuid: uuidv4(),
      url: request.url,
      request,
      response,
      date: message.date,
      deltaTime: message.deltaTime,
      duration: message.payload.duration,
    };
    data.push(item);
    notifyAllClientsJSON(item);
  }
}

export default () => (mezzo: Mezzo) => {
  // export default (app: express.Express, expressServer: Server) => {
  const websocketServer = new WebSocket.Server({ server: mezzo.server });
  setupAPI(mezzo.app);
  websocketServer.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    id += 1;
    clients.push({
      id,
      ws,
    });
    // TODO why are 4 clients connecting from one browser?
    console.log(
      'Total Clients: ',
      clients.map((i) => i.id)
    );
    ws.on('message', (message: string) => {
      //log the received message and send it back to the client
      if (message.toString() === 'Close') {
        console.log('Removing client: ', id);
        const idx = clients.findIndex((i) => i.id === id);
        clients.splice(idx, 1);
        ws.close();
      } else {
        // attempt to parse
        try {
          const data = JSON.parse(message);
          if (data?.type === 'api.response') {
            processRequestResponseMessage(data);
            console.log('Found api response', data);
          }
        } catch (e) {
          logger.error('Error parsings ws message', e);
        }
      }

      console.log('received: %s', message);
      // ws.send(`Hello, you sent -> ${message}`);
    });
    //send immediatly a feedback to the incoming connection
    // ws.send('Hi there, I am a WebSocket server');
    // ping(ws);
  });

  mezzo.websocketServer = websocketServer;
};
