import * as express from 'express';
import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import logger from '@caribou-crew/mezzo-utils-logger';
import { findRouteIndexById } from '../utils/routeMatchingUtils';
import { Mezzo, MezzoStartOptions } from '../core';
import * as path from 'path';
import { version } from '../../../package.json';
// import { StaticRouter } from 'react-router-dom/server';
import {
  GetRoutesResponse,
  // MezzoStartOptions,
  SetRouteVariant,
} from '@caribou-crew/mezzo-interfaces';

export const addAdminEndpoints = (app: express.Express, mezzo: Mezzo) => {
  app.get(`${MEZZO_API_PATH}/routes`, (req, res) => {
    const response: GetRoutesResponse = {
      routes: mezzo.util.serialiazeRoutes(),
      appVersion: version,
      variantCategories: mezzo.variantCategories,
    };
    res.json(response);
  });

  app.post(`${MEZZO_API_PATH}/routeVariants/set`, (req, res) => {
    const payload: SetRouteVariant = req.body;

    payload.forEach((item) => {
      const index = findRouteIndexById(item.routeID, mezzo.userRoutes);
      const foundRoute = mezzo.userRoutes[index];
      if (foundRoute) {
        const updatedItem = foundRoute.setVariant(item.variantID);
        mezzo.userRoutes[index] = updatedItem;
      } else {
        logger.warn(
          `Could not find route for ${item.routeID} to set variant ${item.variantID}`
        );
      }
    });

    res.sendStatus(200);
  });

  app.delete(`${MEZZO_API_PATH}/routeVariants`, (req, res) => {
    mezzo.userRoutes.forEach((route) => {
      route.setVariant('default');
    });
    res.sendStatus(200);
  });

  app.post(
    `${MEZZO_API_PATH}/sessionVariantState/set/:sessionId`,
    (req, res) => {
      const sessionId = req.params.sessionId;
      const payload: SetRouteVariant = req.body;
      mezzo.sessionState.setSessionVariantStateByKey(sessionId, payload);
      res.sendStatus(200);
    }
  );

  app.post(
    `${MEZZO_API_PATH}/sessionVariantState/update/:sessionId`,
    (req, res) => {
      const sessionId = req.params.sessionId;
      const payload: SetRouteVariant = req.body;
      mezzo.sessionState.updateSessionVariantStateByKey(sessionId, payload);
      res.sendStatus(200);
    }
  );

  app.delete(`${MEZZO_API_PATH}/sessionVariantState/:sessionId`, (req, res) => {
    const sessionId = req.params.sessionId;
    mezzo.sessionState.resetSessionVariantStateByKey(sessionId);
    res.sendStatus(200);
  });

  app.delete(`${MEZZO_API_PATH}/sessionVariantState`, (req, res) => {
    mezzo.sessionState.resetSessionVariantState();
    res.sendStatus(200);
  });
};

const staticPath = path.join(__dirname, '..', '..', 'public');
export const addAdminStaticSite = (
  app: express.Express,
  options?: MezzoStartOptions
) => {
  const rootAdmin = `/${options?.adminEndpoint ?? 'mezzo'}`;

  logger.debug(`Adding endpoint: ${rootAdmin} reading html from ${staticPath}`);

  const validClientRoutes = [rootAdmin, `${rootAdmin}/record`];

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
  logger.debug('Admin Endpoints attaching');
  addAdminEndpoints(mezzo.app, mezzo);
  addAdminStaticSite(mezzo.app, mezzo.options);
  addSiteManifest(mezzo.app);
  return {
    name: 'admin-endpoints-plugins',
  };
};
