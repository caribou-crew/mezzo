export interface RouteOrVariantIcon {
  name: string;
  link?: string;
  color?: string;
}

export interface GetRoutesResponse {
  appVersion: string;
  routes: RouteItemType[];
  variantCategories: VariantCategory[];
}

export interface VariantItem {
  id: string;
  label?: string;
  icons?: RouteOrVariantIcon[];
  category?: string;
}

// TODO, this is almost a duplicate of core/src/types RouteData, address? This is the html facing API return value though
export interface RouteItemType {
  id: string; // GET /appium
  activeVariant: string; // default
  label?: string; // /appium
  method: string; // GET
  path: string | RegExp; // /appium
  variants: VariantItem[];
  titleIcons?: RouteOrVariantIcon[];
}

export type VariantCategory = {
  name: string;
  order: number;
};

export interface RouteVariant {
  routeID: string;
  variantID: string;
}

export interface Profile {
  name: string;
  variants: RouteVariant[];
}

export type SetRouteVariant = RouteVariant[];

/**
 * Server options used when starting mezzo
 */
// export interface MezzoStartOptions {
//   port: number | string;
//   adminEndpoint?: string;
//   mockedDirectory?: string;
//   fsOverride?: any;
//   variantCategories?: VariantCategory[];
//   plugins?: (any) => Record<string, any>[];
// }

/**
 * Options used for set/update/reset mock variant util calls
 */
export interface ServerConnectionOptions {
  useHttps?: boolean;
  hostname?: string;
  port?: number;
  // plugins?: any[];
}

export type Fetch = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

// Network record/response types
export interface RecordedRequest {
  config: Record<string, any>;
}
export interface MezzoRecordedResponse {
  body: any;
  status: any;
  headers: any;
}
export interface MezzoRecordedRequest {
  url: any;
  method: any;
  data: any;
  headers: any;
  params: any;
}
export interface RecordedResponse {
  body: any;
  headers: Record<string, string>;
  redirected: boolean;
  status: number;
  statusText: string;
  type: string;
}

export interface GetActiveVariantsResponse {
  variants: RouteVariant[];
}

export interface ProfileResponse {
  profiles: Profile[];
}

export interface ClientOptions {
  /**
   * A function which returns a websocket.
   *
   * This is over-engineered because we need the ability to create different
   * types of websockets for React Native, React, and NodeJS.  :|
   */
  createSocket?: (path?: string) => any;

  /**
   * The hostname or ip address of the server.  Default: localhost.
   */
  host?: string;

  /**
   * The port to connect to the server on.  Default: 9090.
   */
  port?: number;

  /**
   * The name of this client. Usually the app name.
   */
  name?: string;

  /**
   * Will we be connecting via SSL?
   */
  secure?: boolean;

  /**
   * A list of plugins.
   */
  // plugins?: ((reactotron: ReactotronCore) => any)[]

  /**
   * Performs safety checks when serializing.  Default: true.
   *
   * Will do things like:
   * - remap falsy values to transport-friendly version
   * - remove any circular dependencies
   * - remap functions to something that shows their name
   *
   * Hooray for JavaScript!
   */
  safeRecursion?: boolean;

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

  ignoreContentTypes?: RegExp;
  ignoreUrls?: RegExp;
}

export interface SocketRequestResponseMessage {
  type: string;
  payload:
    | {
        request: MezzoRecordedRequest;
        response: MezzoRecordedResponse;
        duration: number;
      }
    | Record<string, never>;
  important: boolean;
  date: string;
  deltaTime: number;
}

export interface RecordedItemOld {
  uuid: string;
  resource: string;
  request: RecordedRequest;
  startTime: number;
  endTime?: number;
  duration?: number;
  url?: string;
  response?: RecordedResponse;
}
export interface RecordedItem {
  uuid: string;
  url?: string;
  request: MezzoRecordedRequest;
  response?: MezzoRecordedResponse;
  date: string;
  deltaTime: number;
  duration: number;
}
