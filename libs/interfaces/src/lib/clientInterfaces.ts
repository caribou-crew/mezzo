export interface IMezzoReactotronOptions {
  ignoreContentTypes?: RegExp;
  ignoreUrls?: RegExp[];
  mezzo?: IClientOptions;
}

export interface IClientOptions
  extends IRESTClientOptions,
    IWebSocketClientOptions {}

export interface ISharedClientOptions {
  /**
   * The hostname or ip address of the server.  Default: localhost.
   */
  hostname?: string;

  /**
   * The port to connect to the server on.  Default: 8000.
   */
  port?: number;

  /**
   * The name of this client. Usually the app name.
   */
  name?: string;

  /**
   * Will we be connecting via SSL?
   * prior implementations were useHttps
   */
  secure?: boolean;

  /**
   * Will relative urls be used?
   * If so host, port, and secure properties are ignored
   */
  useRelativeUrl?: boolean;
}

export type IRESTClientOptions = ISharedClientOptions;

export interface IWebSocketClientOptions extends ISharedClientOptions {
  /**
   * A function which returns a websocket.
   *
   * This is over-engineered because we need the ability to create different
   * types of websockets for React Native, React, and NodeJS.  :|
   */
  createSocket?: (path?: string) => any;

  /**
   * Fires when the server sends a command.
   */
  onCommand?: (command: any) => void;

  /**
   * Fires when we connect to the server.
   */
  onConnect?: () => void;

  /**
   * Fires when we disconnect from the server.
   */
  onDisconnect?: () => void;

  /**
   * The NODE_ENV environment, if any.
   */
  environment?: string;

  /**
   * A way for the client libraries to identify themselves.
   */
  client?: any;

  /**
   * Save the client id provided by the server
   */
  setClientId?: (clientId: any) => Promise<void>;

  /**
   * Get the client id provided by the server
   */
  getClientId?: () => Promise<string>;

  proxyHack?: boolean;

  //   ignoreContentTypes?: RegExp;
  //   ignoreUrls?: RegExp;
}
