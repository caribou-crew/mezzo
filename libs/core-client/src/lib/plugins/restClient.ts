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
  RecordedItem,
} from '@caribou-crew/mezzo-interfaces';
import axios from 'axios';
import * as log from 'loglevel';
log.setDefaultLevel('debug');

export interface IMezzoRouteClient {
  setMockVariant: (payload: SetRouteVariant) => Promise<void>;
  setMockVariantForSession: (
    sessionId: string,
    payload: SetRouteVariant
  ) => Promise<void>;
}

export function restClient(clientOptions: IRESTClientOptions) {
  log.debug('Setting options as: ', clientOptions);

  const getConnectionFromOptions = (
    options: IRESTClientOptions = clientOptions
  ) => {
    log.debug('Reading options as', options);
    if (options?.useRelativeUrl) {
      return MEZZO_API_PATH;
    }
    const protocol = options?.secure ? 'https' : 'http';
    const hostname = options?.hostname ?? LOCAL_HOST;
    const portValue = options?.port ?? clientOptions?.port;
    const portIfDefined = portValue === null ? '' : `:${portValue}`;
    // return `${protocol}://${hostname}:${port}${MEZZO_API_PATH}`;
    return `${protocol}://${hostname}${portIfDefined}${MEZZO_API_PATH}`;
  };

  const setMockVariant = async (
    payload: SetRouteVariant,
    options?: IRESTClientOptions
  ) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants/set`;
    await axios.post(url, payload);
  };

  const setMockVariantForSession = async (
    sessionId: string,
    payload: SetRouteVariant,
    options?: IRESTClientOptions
  ) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/set/${sessionId}`;
    await axios.post(url, payload);
  };

  const updateMockVariant = async (
    payload: SetRouteVariant,
    options?: IRESTClientOptions
  ) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants/update`;
    await axios.post(url, payload);
  };

  const updateMockVariantForSession = async (
    sessionId: string,
    payload: SetRouteVariant,
    options?: IRESTClientOptions
  ) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/update/${sessionId}`;
    await axios.post(url, payload);
  };

  const resetMockVariant = async (options?: IRESTClientOptions) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/routeVariants`;
    await axios.delete(url);
  };

  const resetMockVariantForSession = async (
    sessionId: string,
    options?: IRESTClientOptions
  ) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState/${sessionId}`;
    await axios.delete(url);
  };

  const resetMockVariantForAllSessions = async (
    options?: IRESTClientOptions
  ) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/sessionVariantState`;
    await axios.delete(url);
  };

  const getRoutes = async (options?: IRESTClientOptions) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/routes`;
    // const url = `/routes`;
    return axios.get<GetRoutesResponse>(url);
  };

  const getActiveVariants = async (options?: IRESTClientOptions) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/activeVariants`;
    return axios.get<GetActiveVariantsResponse>(url);
  };

  const getRemoteProfiles = async (options?: IRESTClientOptions) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/profiles`;
    return axios.get<ProfileResponse>(url);
  };

  const getLocalProfiles = () => {
    const data: Profile[] =
      JSON.parse(localStorage.getItem(PROFILE_NAMESPACE) || '[]') ?? [];
    return data;
  };

  const getRecordings = async (options?: IRESTClientOptions) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/recordings`;
    return axios.get<{ items: RecordedItem[] }>(url);
  };

  const deleteRecordings = async (options?: IRESTClientOptions) => {
    const baseUri = getConnectionFromOptions(options);
    const url = `${baseUri}/recordings`;
    return axios.delete(url);
  };

  return {
    getConnectionFromOptions,
    setMockVariant,
    setMockVariantForSession,
    updateMockVariant,
    updateMockVariantForSession,
    resetMockVariant,
    resetMockVariantForSession,
    resetMockVariantForAllSessions,
    getRoutes,
    getActiveVariants,
    getRemoteProfiles,
    getLocalProfiles,
    getRecordings,
    deleteRecordings,
  };
}
