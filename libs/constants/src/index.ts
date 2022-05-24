// export * from './lib/constants';

export const X_REQUEST_VARIANT = 'x-request-variant';
export const X_REQUEST_SESSION = 'x-request-session';
export const DEFAULT_VARIANT = 'default';
export const LOCAL_HOST = 'localhost';
export const DEFAULT_PORT = 8000;
export const DEFAULT_VARIANT_CATEGORY = 'Variants';
export const GLOBAL_VARIANT_CATEGORY = 'Global Variants';

// API endpoints
export const MEZZO_API_PATH = '/_admin/api';
export const MEZZO_API_GET_RECORDINGS = `${MEZZO_API_PATH}/recordings`;
export const MEZZO_API_GET_RECORDING_CLIENTS = `${MEZZO_API_PATH}/recordings/clients`;

// WS Messages
export const MEZZO_WS_API_REQUEST = 'api.request';
export const MEZZO_WS_API_RESPONSE = 'api.response';

// Client
export const PROFILE_NAMESPACE = 'mezzo-profiles';
