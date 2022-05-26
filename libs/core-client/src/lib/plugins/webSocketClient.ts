/**
 * TODO: Figure out why constants were undefined, should they just be hardcoded per package?
 */
import {
  IWebSocketClientOptions,
  MezzoRecordedRequest,
  MezzoRecordedResponse,
  SocketRequestResponseMessage,
} from '@caribou-crew/mezzo-interfaces';
import { generateGuid } from '@caribou-crew/mezzo-utils-generate-guid';
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

  let _readyState = -1;

  let _isConnected = false;

  /**
   * Messages that need to be sent.
   */
  let sendQueue: any[] = [];
  // socket: WebSocket = null;
  let socket: any = null;

  const connect = () => {
    log.debug('[mezzo-core-client.connect]', 'Connecting to', options);
    _isConnected = true;
    const {
      createSocket,
      useRelativeUrl,
      hostname,
      environment,
      port,
      name,
      client = {},
      getClientId,
      setClientId,
      onCommand,
      onConnect,
      onDisconnect,
    } = options;

    let location = `ws://${hostname}:${port}`;
    if (useRelativeUrl) {
      // host: "localhost:4200"
      // hostname: "localhost"
      // href: "http://localhost:4200/mezzo/record"
      // origin: "http://localhost:4200"
      // pathname: "/mezzo/record"
      // port: "4200"
      // protocol: "http:"

      if (process.env['NODE_ENV'] === 'production') {
        // works in prod since web & core-server are same host
        location = `ws://${window.location.host}`;
      } else {
        // Works in dev since web and core-server are on separate hosts
        location = `ws://${window.location.hostname}:${port}`;
      }
    }

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
      _readyState = WebSocket.OPEN;
      console.log('Just set readystate to open', WebSocket.OPEN);
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
      isReady = false;
      _readyState = WebSocket.CLOSING;
      connectDebounced?.cancel(); // if for some reason a connection attempt debounce is in flight but we disconnect, cancel (unit test was not stopping properly on close w/out this)
      onDisconnect?.();
      _readyState = WebSocket.CLOSED;
    };

    // fires when we receive a command, just forward it off
    const onMessage = (data: any) => {
      // When running via node, typeof data is `object`, but on client it is `string`
      const command =
        typeof data === 'string' || typeof data === 'object'
          ? JSON.parse(data)
          : data;
      // trigger our own command handler
      onCommand?.(command);

      if (command.type === 'setClientId') {
        setClientId?.(command.payload);
      } else if (command.type === 'ping') {
        send('pong');
      }
    };

    mySocket.onopen = onOpen;
    mySocket.onclose = onClose;
    mySocket.onmessage = (evt: any) => onMessage(evt.data);

    socket = mySocket;
  };

  const connectDebounced = debounce(connect, 1000);

  const close = () => {
    log.info('[mezzo-core-client.close] socket closing');
    _isConnected = false;
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

    const serializedMessage = JSON.stringify(fullMessage);

    if (isReady) {
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
    const ok = response?.status >= 200 && response?.status <= 299;
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

  // Don't return strings, numbers as those won't change/update
  return {
    send,
    captureApiRequest,
    captureApiResponse,
    connect,
    getReadyState: () => _readyState,
    isConnected: () => _isConnected,
    close,
  };
}
