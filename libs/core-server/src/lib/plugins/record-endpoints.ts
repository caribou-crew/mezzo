import WebSocket from 'ws';
import express from 'express';
import {
  MEZZO_API_GET_RECORDINGS,
  MEZZO_API_GET_RECORDING_CLIENTS,
} from '@caribou-crew/mezzo-constants';
import {
  IMezzoServerPlugin,
  RecordedItem,
  SocketRequestResponseMessage,
} from '@caribou-crew/mezzo-interfaces';
import { Mezzo } from '../core';
import logger from '@caribou-crew/mezzo-utils-logger';
import { generateGuid } from '@caribou-crew/mezzo-utils-generate-guid';

interface Client {
  id: number;
  ws: WebSocket;
  pingTimeout?: NodeJS.Timeout;
  disconnectTimeout?: NodeJS.Timeout;
}
const clients: Client[] = [];
let id = 0;

const keepAliveInterval = 5000;
const disconnectAfterSilence = keepAliveInterval * 3.5;
const recordedItems: RecordedItem[] = [];

function setupRestApi(app: express.Express) {
  logger.info('Adding GET endpoint');
  app.get(MEZZO_API_GET_RECORDINGS, (req, res) => {
    logger.info('Inside GET endpoint');
    res.send({
      items: recordedItems,
    });
  });
  app.delete(MEZZO_API_GET_RECORDINGS, (req, res) => {
    recordedItems.length = 0;
    res.sendStatus(204);
  });
  app.get(MEZZO_API_GET_RECORDING_CLIENTS, (req, res) => {
    res.send({
      clients: clients.map((c) => c.id),
    });
  });
}

function setupWebSocketServer(mezzo: Mezzo) {
  const websocketServer = new WebSocket.Server({ server: mezzo.server });
  websocketServer.on('connection', (ws: WebSocket) => {
    id += 1;
    const client = {
      id,
      ws,
    };
    clients.push(client);
    logger.info(
      'Client connected to recording socket server, total clients: ',
      clients.map((i) => i.id)
    );

    ws.on('message', (message: string) => {
      // Process message from the client
      processMessage(message, client);
    });
    // If it is desired for server to send message to client on connect, add ws.send(...) here
    ping(client);
  });

  mezzo.websocketServer = websocketServer;
}

function broadcastJSON(message: any, type?: string) {
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
    recordedItems.push(item);
    broadcastJSON(item, 'api.response');
  } else {
    logger.warn(
      "Received message but didn't add to data itmes as type was null"
    );
  }
}
function ping(client: Client) {
  const { ws } = client;
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
    // set disconnect timeout, if pong not received by then disconnect user
    client.disconnectTimeout = setTimeout(() => {
      removeClient(client);
    }, disconnectAfterSilence);
  } else {
    removeClient(client);
  }
}

function removeClient(client: Client) {
  logger.info(`Client ${client.id} disconnected`);
  clearTimeout(client.pingTimeout);
  clearTimeout(client.disconnectTimeout);
  const idx = clients.findIndex((i) => i.id === client.id);
  clients.splice(idx, 1);
  client.ws.close();
}

function processMessage(message, client: Client) {
  try {
    const data = JSON.parse(message);
    logger.debug('Message received', data?.type);
    if (data?.type === 'api.response') {
      logger.debug('Received api response');
      processRequestResponseMessage(data);
    } else if (data?.type === 'pong') {
      clearTimeout(client.disconnectTimeout);
      client.pingTimeout = setTimeout(() => {
        ping(client);
      }, keepAliveInterval);
    } else if (data?.type === 'close') {
      removeClient(client);
    }
  } catch (e) {
    logger.error('Error parsings ws message', e);
  }
}

export default () =>
  (mezzo: Mezzo): IMezzoServerPlugin => {
    setupRestApi(mezzo.app);
    setupWebSocketServer(mezzo);
    return {
      name: 'recording-endpoints-plugin',
      initialize: () => {
        clients.length = 0;
        recordedItems.length = 0;
      },
      onStop: () => {
        clients.forEach((client) => {
          clearTimeout(client.disconnectTimeout);
          clearTimeout(client.pingTimeout);
        });
        recordedItems.length = 0;
        clients.length = 0;
        id = 0;
      },
    };
  };
