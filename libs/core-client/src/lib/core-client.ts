import {
  ClientOptions,
  ServerConnectionOptions,
} from '@caribou-crew/mezzo-interfaces';
import * as log from 'loglevel';
import {
  createRecordingClient,
  MezzoRecordingClient,
} from './plugins/recording-client';
import {
  createVariantClient,
  MezzoVariantClient,
} from './plugins/variant-client';

log.setDefaultLevel('debug');

export class MezzoClient {
  public recordingClient: MezzoRecordingClient | null = null;
  public variantClient: MezzoVariantClient | null = null;

  public initRecording(recordingOptions?: ClientOptions) {
    this.recordingClient = createRecordingClient(recordingOptions);
    return this;
  }

  public initVariant(variantOptions?: ServerConnectionOptions) {
    this.variantClient = createVariantClient(variantOptions);
    return this;
  }

  // constructor() {
  // variantOptions?: ServerConnectionOptions // recordingOptions?: ClientOptions,
  // this.variantClient = createVariantClient(variantOptions);
  // }
}

// export function createClient(options?: ClientOptions) {
//   const client = new MezzoClient();
//   client.configure(options);
//   client.connect();
//   return client;
// }
