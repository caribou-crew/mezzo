import WebSocket from 'ws';
import express from 'express';
import { MEZZO_API_GET_RECORDINGS } from '@caribou-crew/mezzo-constants';
import {
  RecordedItem,
  SocketRequestResponseMessage,
} from '@caribou-crew/mezzo-interfaces';
import { Mezzo } from '../core';
import logger from '@caribou-crew/mezzo-utils-logger';

function generateGuid() {
  let result, i, j;
  result = '';
  for (j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + '-';
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  return result;
}
// TODO type this object in interfaces so that it can also be used via RecordingScreen.tsx
interface Clients {
  id: number;
  ws: WebSocket;
}
const clients: Clients[] = [];
let id = 0;

const data: RecordedItem[] = [];

function setupAPI(app: express.Express) {
  logger.info('Adding GET endpoint');
  app.get(MEZZO_API_GET_RECORDINGS, (req, res) => {
    logger.info('Inside GET endpoint');
    res.send({
      data,
    });
  });
}

function notifyAllClientsJSON(message: any, type?: string) {
  logger.debug(`Sending message to all ${clients.length} clients`);
  clients.forEach(({ ws }) => {
    ws.send(JSON.stringify({ type, ...message }));
  });
}

function processRequestResponseMessage(message: SocketRequestResponseMessage) {
  logger.debug('Processing message: ');
  if (message.type != null) {
    const { request, response } = message.payload;
    const item: RecordedItem = {
      uuid: generateGuid(),
      url: request.url,
      request,
      response,
      date: message.date,
      deltaTime: message.deltaTime,
      duration: message.payload.duration,
    };
    data.push(item);
    notifyAllClientsJSON(item, 'api.response');
  } else {
    logger.warn(
      "Received message but didn't add to data itmes as type was null"
    );
  }
}

function closeClient(ws: WebSocket) {
  logger.debug('Removing client: ', id);
  const idx = clients.findIndex((i) => i.id === id);
  clients.splice(idx, 1);
  ws.close();
}

function processMessage(message, ws: WebSocket) {
  // attempt to parse
  try {
    const data = JSON.parse(message);
    logger.debug('Message received', data?.type);
    if (data?.type === 'api.response') {
      logger.debug('Received api response');
      processRequestResponseMessage(data);
    } else if (data?.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
    } else if (data?.type === 'close') {
      closeClient(ws);
    }
  } catch (e) {
    logger.error('Error parsings ws message', e);
  }
}

function setupWebSocketServer(mezzo: Mezzo) {
  const websocketServer = new WebSocket.Server({ server: mezzo.server });
  websocketServer.on('connection', (ws: WebSocket) => {
    id += 1;
    clients.push({
      id,
      ws,
    });
    logger.info(
      'Client connected to recording socket server, total clients: ',
      clients.map((i) => i.id)
    );

    ws.on('message', (message: string) => {
      processMessage(message, ws);
      // ws.send(`Hello, you sent -> ${message}`);
    });
    //send immediatly when client connets
    // ws.send('Welcome to the mezzo recording socket server');
  });

  mezzo.websocketServer = websocketServer;
}

export default () => (mezzo: Mezzo) => {
  setupAPI(mezzo.app);
  setupWebSocketServer(mezzo);
  return {
    name: 'recording-endpoints-plugin',
  };
};
