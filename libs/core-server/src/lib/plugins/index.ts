import cors from './cors';
import jsonBodyParser from './json-body-parser';
import profileEndpoints from './profile-endpoints';
import recordEndpoints from './record-endpoints';
import routesEndpoints from './routes-endpoints';
import serverInfoEndpoints from './server-info-endpoints';
import staticSiteEndpoints from './static-site-endpoints';

export const corePlugins = [
  cors,
  jsonBodyParser,
  serverInfoEndpoints,
  staticSiteEndpoints,
  routesEndpoints,
];

export const profileEndpointsPlugin = profileEndpoints;
export const recordEndpointsPlugin = recordEndpoints;

export const corsPlugin = cors;
export const jsonBodyParserPlugin = jsonBodyParser;
export const routesEndpointsPlugin = routesEndpoints;
export const serverInfoEndpointsPlugin = serverInfoEndpoints;
export const staticSiteEndpointsPlugin = staticSiteEndpoints;
