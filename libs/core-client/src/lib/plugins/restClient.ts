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
  IRESTClientOptions,
  SetRouteVariant,
} from '@caribou-crew/mezzo-interfaces';
import axios from 'axios';

export interface IMezzoRouteClient {
  setMockVariant: (payload: SetRouteVariant) => Promise<void>;
  setMockVariantForSession: (
    sessionId: string,
    payload: SetRouteVariant
  ) => Promise<void>;
}

export class RESTClient {
  options: IRESTClientOptions;

  constructor(options: IRESTClientOptions) {
    this.options = options;
  }

  getConnectionFromOptions(options?: IRESTClientOptions) {
    const protocol = options?.secure ? 'https' : 'http';
    const hostname = options?.hostname ?? LOCAL_HOST;
    const port = options?.port ?? this.options.port;
    return `${protocol}://${hostname}:${port}${MEZZO_API_PATH}`;
  }

  public setMockVariant = async (
    payload: SetRouteVariant,
    options: IRESTClientOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants/set`;
    await axios.post(url, payload);
  };

  public setMockVariantForSession = async (
    sessionId: string,
    payload: SetRouteVariant,
    options: IRESTClientOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/set/${sessionId}`;
    await axios.post(url, payload);
  };

  public updateMockVariant = async (
    payload: SetRouteVariant,
    options: IRESTClientOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants/update`;
    await axios.post(url, payload);
  };

  public updateMockVariantForSession = async (
    sessionId: string,
    payload: SetRouteVariant,
    options: IRESTClientOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/update/${sessionId}`;
    await axios.post(url, payload);
  };

  public resetMockVariant = async (
    options: IRESTClientOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants`;
    await axios.delete(url);
  };

  public resetMockVariantForSession = async (
    sessionId: string,
    options: IRESTClientOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/${sessionId}`;
    await axios.delete(url);
  };

  public resetMockVariantForAllSessions = async (
    options: IRESTClientOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState`;
    await axios.delete(url);
  };

  public getRoutes = async (options: IRESTClientOptions = this.options) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/routes`;
    return axios.get<GetRoutesResponse>(url);
  };

  public getActiveVariants = async (
    options: IRESTClientOptions = this.options
  ) => {
    const baseUri = this.getConnectionFromOptions(options);
    const url = `${baseUri}/activeVariants`;
    return axios.get<GetActiveVariantsResponse>(url);
  };

  public getRemoteProfiles = async (
    options: IRESTClientOptions = this.options
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
