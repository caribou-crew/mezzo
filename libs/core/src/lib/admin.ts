import * as express from 'express';
import { MezzoStartOptions } from '../types';
import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import logger from '../utils/logger';
import { findRouteIndexById } from '../utils/routeMatchingUtils';
import { Mezzo } from './core';
import * as path from 'path';
import { version } from '../../package.json';
import {
  GetRoutesResponse,
  SetRouteVariant,
} from '@caribou-crew/mezzo-interfaces';

export const addAdminEndpoints = (app: express.Express, mezzo: Mezzo) => {
  app.get(`${MEZZO_API_PATH}/routes`, (req, res) => {
    const response: GetRoutesResponse = {
      routes: mezzo.serialiazeRoutes(),
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

  // ===================================
  // NOT YET IMPLEMENTED
  // ===================================
  app.get(`/api`, (req, res) => {
    res.status(200).json({ message: 'Hello world from api' });
  });

  app.post(`${MEZZO_API_PATH}/action`, (req, res) => {
    //TODO
  });
  app.post(`${MEZZO_API_PATH}/state/reset`, (req, res) => {
    //TODO
    res.status(200).json({ message: 'reset' });
  });

  app.post(`${MEZZO_API_PATH}/input/reset`, (req, res) => {
    //TODO
  });
};

export const addAdminStaticSite = (
  app: express.Express,
  options?: MezzoStartOptions
) => {
  app.use(
    `/${options?.adminEndpoint ?? 'mezzo'}`,
    express.static(path.join(__dirname, '..', 'public'))
  );
};
