import logger from '@caribou-crew/mezzo-utils-logger';

export function getValidMethod(methodInput?: string) {
  const method = methodInput?.toLowerCase();
  if (
    method === 'get' ||
    method === 'post' ||
    method === 'delete' ||
    method === 'put'
  ) {
    return method.toUpperCase();
  } else {
    if (method !== undefined) {
      // Undefined is safe to assume as /GET, but if mismatch let user know
      logger.warn(`${method} is not a supported method, treating as a GET`);
    }
    return 'GET';
  }
}
