/**
 * TODO: Figure out why constants were undefined, should they just be hardcoded per package?
 */
import {
  IWebSocketClientOptions,
  MezzoRecordedRequest,
  MezzoRecordedResponse,
  SocketRequestResponseMessage,
} from '@caribou-crew/mezzo-interfaces';
import generateGuid from '../utils/generate-guid';
import serialize from '../utils/serialize';
import * as log from 'loglevel';
import debounce from 'lodash.debounce';

// for some reason stuck at undefined, at least testing in RN interceptor
// import {
//   MEZZO_WS_API_REQUEST,
//   MEZZO_WS_API_RESPONSE,
// } from '@caribou-crew/mezzo-constants';
const MEZZO_WS_API_REQUEST = 'api.request';
const MEZZO_WS_API_RESPONSE = 'api.response';

log.setDefaultLevel('debug');

function emptyPromise() {
  return Promise.resolve('');
}
export enum ArgType {
  String = 'string',
}
export interface CustomCommandArg {
  name: string;
  type: ArgType;
}
export interface CustomCommand {
  id?: number;
  command: string;
  handler: (args?: any) => void;

  title?: string;
  description?: string;
  args?: CustomCommandArg[];
}

export function webSocketClient(options: IWebSocketClientOptions) {
  /**
   * The last time we sent a message.
   */
  let lastMessageDate = new Date();

  /**
   * Are we ready to start communicating?
   */
  let isReady = false;

  let readyState = -1;

  let isConnected = false;

  let lastHeartbeat = new Date();

  const heartbeatTimeout: any = undefined;

  /**
   * The registered custom commands
   */
  const customCommands: CustomCommand[] = [];
  /**
   * Messages that need to be sent.
   */
  let sendQueue: any[] = [];
  // socket: WebSocket = null;
  let socket: any = null;

  const connect = () => {
    log.debug('[mezzo-core-client.connect]', 'Connecting to', options);
    isConnected = true;
    const {
      createSocket,
      secure,
      hostname,
      environment,
      port,
      name,
      client = {},
      getClientId,
      onCommand,
      onConnect,
      onDisconnect,
    } = options;

    const location = `ws://${hostname}:${port}`;

    if (!createSocket) {
      log.error(
        '[mezzo-core-client.connect] You must supply createSocket argument'
      );
    }
    const mySocket = createSocket?.(`${location}`);

    // fires when we talk to the server
    const onOpen = async () => {
      log.debug(
        '[mezzo-core-client.onOpen]: client socket connection to server is open'
      );

      // fire our optional onConnect handler
      onConnect?.();

      const getClientIdPromise = getClientId || emptyPromise;

      const clientId = await getClientIdPromise();

      isReady = true;
      readyState = WebSocket.OPEN;
      // introduce ourselves
      send('client.intro', {
        environment,
        ...client,
        name,
        clientId,
        reactotronCoreClientVersion: 'MEZZO_CORE_VERSION',
      });

      // flush the send queue
      console.log('SQ: ', sendQueue);
      while (sendQueue.length > 0) {
        const h = sendQueue[0];
        sendQueue = sendQueue.slice(1);
        mySocket.send(h);
      }
    };

    // fires when we disconnect
    const onClose = () => {
      log.info('[mezzo-core-client.onClose] Closing socket continued');
      clearTimeout(heartbeatTimeout);
      isReady = false;
      // isConnected = false;
      readyState = WebSocket.CLOSING;
      // trigger our disconnect handler
      onDisconnect?.();
      readyState = WebSocket.CLOSED;

      // as well as the plugin's onDisconnect
      // plugins.forEach((p) => p.onDisconnect && p.onDisconnect());
    };

    // fires when we receive a command, just forward it off
    const onMessage = (data: any) => {
      // console.debug(
      //   '[mezzo-core-client.onMessage] Received message via socket: ',
      //   data
      // );
      // console.log('Socket got message', data.toString());
      const command = typeof data === 'string' ? JSON.parse(data) : data;
      // console.debug(`Command: ${command}`);
      // trigger our own command handler
      onCommand?.(command);

      // trigger our plugins onCommand
      // plugins.forEach((p) => p.onCommand && p.onCommand(command));

      // trigger our registered custom commands
      // if (command.type === 'custom') {
      //   customCommands
      //     .filter((cc) => {
      //       if (typeof command.payload === 'string') {
      //         return cc.command === command.payload;
      //       }

      //       return cc.command === command.payload.command;
      //     })
      //     .forEach((cc) =>
      //       cc.handler(
      //         typeof command.payload === 'object'
      //           ? command.payload.args
      //           : undefined
      //       )
      //     );
      if (command.type === 'setClientId') {
        options.setClientId?.(command.payload);
      } else if (command.type === 'pong') {
        log.debug('[heartbeat]');
        lastHeartbeat = new Date();
      }
    };

    // this is ws style from require('ws') on node js
    // if (mySocket.on) {
    //   log.info('!!!!!!!!!!!!!!! DOES RN SEE THIS??!!!!!!!!');
    //   mySocket.on('open', onOpen);
    //   mySocket.on('close', onClose);
    //   mySocket.on('message', onMessage);
    // } else {
    // log.info('!!!!!!!!!!!!!!! or browser !!!!!!!!');
    // this is a browser
    mySocket.onopen = onOpen;
    mySocket.onclose = onClose;
    mySocket.onmessage = (evt: any) => onMessage(evt.data);
    // }

    socket = mySocket;
    // on = mySocket.on;
  };

  const connectDebounced = debounce(connect, 1000);

  const close = () => {
    log.info('[mezzo-core-client.close] socket closing');
    isConnected = false;
    socket.close();
  };

  // let on: any;

  /**
   * Sends a command to the server
   */
  const send = (type: string, payload = {}, important = false) => {
    log.debug('[mezzo-core-client.send]', {
      type,
      payload,
      important,
      isReady: isReady,
    });
    // set the timing info
    const date = new Date();
    let deltaTime = date.getTime() - lastMessageDate.getTime();
    // glitches in the matrix
    if (deltaTime < 0) {
      deltaTime = 0;
    }
    lastMessageDate = date;

    const fullMessage: SocketRequestResponseMessage = {
      type,
      payload,
      important: !!important,
      date: date.toISOString(),
      deltaTime,
    };

    const serializedMessage = serialize(fullMessage, options.proxyHack);

    if (isReady) {
      log.debug('[core-client-send] attempting to send as markred as isReady');
      // console.log('Sending command');
      // send this command
      try {
        socket.send(serializedMessage);
      } catch {
        isReady = false;
        console.log('An error occured communicating with the mezzo recorder.');
      }
    } else {
      log.warn(
        '[recording-client]',
        'Queueing command as it is not connected, should attempt to reconnect?'
      );
      // queue it up until we can connect
      sendQueue.push(serializedMessage);

      // connect();
      connectDebounced();
    }
  };

  const captureApiRequest = (method: string, url: string) => {
    const guid = generateGuid();
    console.debug('Firing API request');
    send(MEZZO_WS_API_REQUEST, { method, url, guid });
    return guid;
  };

  const captureApiResponse = (
    request: MezzoRecordedRequest,
    response: MezzoRecordedResponse,
    duration: number,
    guid = generateGuid()
  ) => {
    const ok =
      response &&
      response.status &&
      typeof response.status === 'number' &&
      response.status >= 200 &&
      response.status <= 299;
    const important = !ok;

    log.debug('[mezzo-core-cleint.captureApiResponse]', {
      type: MEZZO_WS_API_RESPONSE,
      request,
      response,
      duration,
      important,
      guid,
    });
    send(MEZZO_WS_API_RESPONSE, { request, response, duration }, important);
  };

  return {
    send,
    captureApiRequest,
    captureApiResponse,
    connect,
    readyState,
    close,
    isConnected,
  };
}
