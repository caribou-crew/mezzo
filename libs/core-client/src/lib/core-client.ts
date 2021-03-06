import { IClientOptions } from '@caribou-crew/mezzo-interfaces';
import * as log from 'loglevel';
import { webSocketClient } from './plugins/webSocketClient';
import { restClient as createRestClient } from './plugins/restClient';

log.setDefaultLevel('debug');

const DEFAULT_OPTIONS: IClientOptions = {
  hostname: undefined,
  createSocket: undefined,
  port: undefined,
  name: 'mezzo-core-client',
  secure: false,
  useRelativeUrl: false,
  onCommand: () => null,
  onConnect: () => null,
  onDisconnect: () => null,
};

export default function mezzoClient(clientOptions?: IClientOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...clientOptions,
  };

  if (!clientOptions?.useRelativeUrl) {
    if (
      clientOptions?.port === undefined &&
      clientOptions?.hostname === undefined
    ) {
      log.debug('Assuming localhost:8000 as no host provided');
      options.hostname = 'localhost';
      options.port = 8000;
    } else if (clientOptions?.hostname === undefined) {
      options.hostname = 'localhost';
    }
  }

  log.debug('MC with options: ', options);

  const wsClient = webSocketClient(options);
  const restClient = createRestClient(options);

  return {
    setMockVariant: restClient.setMockVariant,
    setMockVariantForSession: restClient.setMockVariantForSession,
    updateMockVariant: restClient.updateMockVariant,
    updateMockVariantForSession: restClient.updateMockVariantForSession,
    resetMockVariant: restClient.resetMockVariant,
    resetMockVariantForSession: restClient.resetMockVariantForSession,
    resetMockVariantForAllSessions: restClient.resetMockVariantForAllSessions,
    getRoutes: restClient.getRoutes,
    getActiveVariants: restClient.getActiveVariants,
    getRemoteProfiles: restClient.getRemoteProfiles,
    getLocalProfiles: restClient.getLocalProfiles,
    getRecordings: restClient.getRecordings,
    deleteRecordings: restClient.deleteRecordings,
    getConnectionFromOptions: restClient.getConnectionFromOptions,
    getInfo: restClient.getInfo,

    send: wsClient.send,
    captureApiRequest: wsClient.captureApiRequest,
    captureApiResponse: wsClient.captureApiResponse,
    connect: wsClient.connect,
    close: wsClient.close,
    getReadyState: wsClient.getReadyState,
  };
}
