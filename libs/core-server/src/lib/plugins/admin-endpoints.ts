import express from 'express';
import { DEFAULT_VARIANT, MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import logger from '@caribou-crew/mezzo-utils-logger';
import { findRouteIndexById } from '../utils/routeMatchingUtils';
import { Mezzo, MezzoStartOptions } from '../core';
import * as path from 'path';
import { version } from '../../../package.json';
import {
  GetRoutesResponse,
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

  /**
   * Don't preserve existing, just apply new variant(s) in replace of old
   */
  app.post(`${MEZZO_API_PATH}/routeVariants/set`, (req, res) => {
    const payload: SetRouteVariant = req.body;

    // Reset all routes back to default variant
    mezzo.userRoutes.forEach((i) => {
      i.setVariant(DEFAULT_VARIANT);
    });

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

  /**
   * Preserve old variant(s) while setting new
   */
  app.post(`${MEZZO_API_PATH}/routeVariants/update`, (req, res) => {
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

  /**
   * Used by profiles to get the current list of active variants that are not set to default
   * This is handy if client wants to save the current configurate as a profile
   */
  app.get(`${MEZZO_API_PATH}/activeVariants`, (req, res) => {
    const nonDefaults = [];
    mezzo.userRoutes.forEach((route) => {
      if (route.getActiveVariant() !== DEFAULT_VARIANT) {
        nonDefaults.push({
          routeID: route.id,
          variantID: route.getActiveVariant(),
        });
      }
    });
    res.json({ variants: nonDefaults });
  });

  /**
   * Returns data set in call to mezzo.profile
   */
  app.get(`${MEZZO_API_PATH}/profiles`, (req, res) => {
    res.json({ profiles: mezzo.userProfiles });
    // const nonDefaults = [];
    // mezzo.userRoutes.forEach((route) => {
    //   if (route.getActiveVariant() !== DEFAULT_VARIANT) {
    //     nonDefaults.push({
    //       routeID: route.id,
    //       variantID: route.getActiveVariant(),
    //     });
    //   }
    // });
    // res.json({ variants: nonDefaults });
  });

  /**
   * TODO: If i want to suppot local & global profiles, should client fetch list and structure of profiles
   * and then when "setting" a profile just call setMockVariants passing in data?
   * In this way local & remote profiles are set identically, which is same way regular variants are set
   */
  // app.post(`${MEZZO_API_PATH}/profile`, (req, res) => {
  // });
};

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
  logger.debug('Admin Endpoints attaching');
  addAdminEndpoints(mezzo.app, mezzo);
  addAdminStaticSite(mezzo.app, mezzo.options);
  addSiteManifest(mezzo.app);
  return {
    name: 'admin-endpoints-plugins',
  };
};
