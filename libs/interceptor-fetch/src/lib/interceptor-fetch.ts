import { MezzoClient } from '@caribou-crew/mezzo-core-client';
import {
  ClientOptions,
  Fetch,
  MezzoRecordedRequest,
  MezzoRecordedResponse,
} from '@caribou-crew/mezzo-interfaces';
import * as log from 'loglevel';
import { startTimer } from './utils/start-timer';

log.setDefaultLevel('debug');
const DEFAULTS: ClientOptions = {
  createSocket: (path: string) => new WebSocket(path), // eslint-disable-line
  host: 'localhost',
  port: 8000,
  name: 'Fetch Intercept App',
  environment: process.env.NODE_ENV,
  client: {},
  getClientId: () => {
    return new Promise((resolve) => resolve('Some Temp id'));
  },
};

export function createClient(options?: ClientOptions) {
  const client = new MezzoClient().initRecording(options);
  // client.configure(options);
  // client.connect();
  return client.recordingClient;
}
export const interceptedFetch = (
  originalFetch: Fetch,
  myOptions: ClientOptions
) => {
  const options = {
    ...DEFAULTS,
    ...myOptions,
  };
  log.info(
    '[mezzo-interceptor-fetch.interceptedFetch] Initializing one interceptedFetch',
    options
  );
  const mezzoClient = createClient(options);
  return async (resource: string, config: Record<string, any> = {}) => {
    const options = {
      ...DEFAULTS,
    };

    log.info('[mezzo-interceptor-fetch] about to fetch', {
      resource,
      config,
      options,
    });
    const guid = mezzoClient.captureApiRequest(
      config?.method ?? 'GET',
      resource
    );
    const stopTimer = startTimer();

    // Request
    const response = await originalFetch(resource, config);
    let responseJson;
    try {
      responseJson = await response.clone().json();
    } catch (e) {
      console.error('could not parse json of response from ' + resource);
      responseJson = undefined;
    }

    const mezzoRequest: MezzoRecordedRequest = {
      url: resource,
      method: config?.method ?? 'GET',
      data: config?.body,
      headers: config?.headers,
      params: 'TODO',
    };

    const mezzoResponse: MezzoRecordedResponse = {
      body: responseJson,
      status: response.status,
      headers: response.headers,
    };

    mezzoClient.captureApiResponse(
      mezzoRequest,
      mezzoResponse,
      stopTimer(),
      guid
    );

    return response;
  };
};
