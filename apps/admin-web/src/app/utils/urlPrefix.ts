/**
 * In prod build admin web is built with core and served under /mezzo.
 * In dev build it is served up at the root from another port
 * TODO: Consdier serving same in both?
 */
// export const prefix =
//   process.env['NODE_ENV'] === 'production' ? '/mezzo/' : '/';

// Only downside if this changes so too should webpack config on baseHref
export const PUBLIC_URL = process.env['NX_PUBLIC_URL'] ?? '/';
// Had trouble with env files in prod the way I'm building, for now just keep base url the same even in dev
// export const PUBLIC_URL = '/mezzo/';
