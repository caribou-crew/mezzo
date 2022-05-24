import express from 'express';
import logger from '@caribou-crew/mezzo-utils-logger';
import { Mezzo, MezzoStartOptions } from '../core';
import * as path from 'path';

const staticPath = path.join(__dirname, '..', '..', 'public');
export const addAdminStaticSite = (
  app: express.Express,
  options?: MezzoStartOptions
) => {
  const rootAdmin = `/${options?.adminEndpoint ?? 'mezzo'}`;

  logger.debug(`Adding endpoint: ${rootAdmin} reading html from ${staticPath}`);

  const validClientRoutes = [
    rootAdmin,
    `${rootAdmin}/record`,
    `${rootAdmin}/profiles`,
  ];

  validClientRoutes.forEach((clientRoute) => {
    logger.debug(`Adding nedpoint ${clientRoute} for server side reload`);
    app.use(clientRoute, express.static(staticPath));
  });
};

export const addSiteManifest = (app: express.Express) => {
  const items = [
    '/favicon.ico',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/apple-touch-icon.png',
    '/android-chrome-512x512.png',
    '/android-chrome-192x192.png',
    '/site.webmanifest',
  ];

  items.forEach((i) => {
    app.use(i, express.static(staticPath));
  });
};

export default () => (mezzo: Mezzo) => {
  addAdminStaticSite(mezzo.app, mezzo.options);
  addSiteManifest(mezzo.app);
  return {
    name: 'static-site-plugins',
  };
};
