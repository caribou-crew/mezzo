import {
  PROFILE_NAMESPACE,
  LOCAL_HOST,
  MEZZO_API_PATH,
} from '@caribou-crew/mezzo-constants';
import {
  GetActiveVariantsResponse,
  GetRoutesResponse,
  Profile,
  ProfileResponse,
  ServerConnectionOptions,
  SetRouteVariant,
} from '@caribou-crew/mezzo-interfaces';
import axios from 'axios';

const DEFAULT_OPTIONS: ServerConnectionOptions = {
  hostname: 'localhost',
  port: 8000,
  useHttps: false,
};

export class MezzoVariantClient {
  options: ServerConnectionOptions = Object.assign({}, DEFAULT_OPTIONS);

  constructor(options?: ServerConnectionOptions) {
    // this.options = options;
    this.options = {
      ...this.options,
      ...options,
    };
  }

  getConnectionFromOptions(options?: ServerConnectionOptions) {
    const protocol = options?.useHttps ? 'https' : 'http';
    const hostname = options?.hostname ?? LOCAL_HOST;
    const port = options?.port ?? this.options.port;
    return `${protocol}://${hostname}:${port}${MEZZO_API_PATH}`;
  }

  public setMockVariant = async (
    payload: SetRouteVariant,
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants/set`;
    await axios.post(url, payload);
  };

  public setMockVariantForSession = async (
    sessionId: string,
    payload: SetRouteVariant,
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/set/${sessionId}`;
    await axios.post(url, payload);
  };

  public updateMockVariant = async (
    payload: SetRouteVariant,
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants/update`;
    await axios.post(url, payload);
  };

  public updateMockVariantForSession = async (
    sessionId: string,
    payload: SetRouteVariant,
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/update/${sessionId}`;
    await axios.post(url, payload);
  };

  public resetMockVariant = async (
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants`;
    await axios.delete(url);
  };

  public resetMockVariantForSession = async (
    sessionId: string,
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/${sessionId}`;
    await axios.delete(url);
  };

  public resetMockVariantForAllSessions = async (
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState`;
    await axios.delete(url);
  };

  public getRoutes = async (
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/routes`;
    return axios.get<GetRoutesResponse>(url);
  };

  public getActiveVariants = async (
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/activeVariants`;
    return axios.get<GetActiveVariantsResponse>(url);
  };

  public getRemoteProfiles = async (
    options: ServerConnectionOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/profiles`;
    return axios.get<ProfileResponse>(url);
  };

  public getLocalProfiles = () => {
    const data: Profile[] =
      JSON.parse(localStorage.getItem(PROFILE_NAMESPACE) || '[]') ?? [];
    return data;
  };
}

export function createVariantClient(options?: ServerConnectionOptions) {
  const client = new MezzoVariantClient(options);
  return client;
}
