import { createServer, Server } from 'http';
import logger, { setLogLevel } from '../utils/logger';
import axios from 'axios';

import { CommonUtils } from '../utils/common-utils';
import {
  MiddlewareFn,
  RouteData,
  RouteVariants,
  ServerOptions,
} from '../types';
import * as express from 'express';
import { Route } from '../models/route-model';
import { addAdminEndpoints, addAdminStaticSite } from './admin';
import * as fsDefault from 'fs';
import { SessionState } from '../models/sessionState';
import { DEFAULT_PORT, MEZZO_API_PATH } from '../utils/constants';

import * as bodyParser from 'body-parser';
import {
  GetMezzoRoutes,
  GetMezzoRoutesRouteData,
  GetMezzoRoutesVariantData,
} from '@caribou-crew/mezzo-interfaces';

export class Mezzo {
  public userRoutes: Route[] = [];
  public sessionState: SessionState;
  private server: Server;
  private app: express.Express;
  private fs;
  public util: CommonUtils;
  public log = {
    setLogLevel,
  };
  public mockedDirectory;
  public port;

  private _resetRouteState = () => (this.userRoutes.length = 0);

  private _addRouteToExpress = (myRoute: Route) => {
    this.app[myRoute.method.toLowerCase()](myRoute.path, <MiddlewareFn>((
      req,
      res,
      next
    ) => {
      myRoute.processRequest(req, res, next);
    }));
  };

  private _addRouteToState = (myRoute: Route) => {
    this.userRoutes.push(myRoute);
  };

  private initializeMiddleware = () => {
    this.app.use(bodyParser.json({ limit: '5mb' }));
  };

  public start = async (options?: ServerOptions): Promise<Server> => {
    this.app = express();
    this._resetRouteState();
    this.initializeMiddleware();
    addAdminEndpoints(this.app, this);
    addAdminStaticSite(this.app, options);
    this.fs = options?.fsOverride ?? fsDefault;
    this.mockedDirectory = options.mockedDirectory;
    this.util = new CommonUtils(this.userRoutes, this.fs, this.mockedDirectory);
    this.sessionState = new SessionState();
    this.port = options?.port ?? DEFAULT_PORT;

    return new Promise((resolve) => {
      this.server = createServer(this.app).listen(this.port, () => {
        logger.debug(
          `***************Server running on port ${this.port} ***************`
        );
        resolve(this.server);
      });
    });
  };

  public stop = async (serverArg?: Server) => {
    const serverToStop = serverArg ?? this.server;
    return new Promise((resolve) => {
      if (serverToStop) {
        logger.debug(
          '***************Stopping Mezzo mocking server ***************'
        );
        serverToStop.close(resolve);
        this.app = undefined;
      } else {
        logger.warn(
          '***************Unable to stop Mezzo mocking server ***************'
        );
        resolve(null);
      }
    });
  };

  /**
   * Add route to mock server
   * @param routeData
   * @returns
   */
  public route = (routeData: RouteData): Route => {
    if (this.app == undefined) {
      logger.error(
        'You have not yet initialied the app, please start before adding routes'
      );
      throw new Error('App not yet initialized');
    }
    const myRoute = new Route(routeData, this.sessionState);
    this._addRouteToExpress(myRoute);
    this._addRouteToState(myRoute);

    return myRoute;
  };

  // https://github.com/sgoff0/midway/blob/6614a6a91d3060951e99326c68333ebf78563e8c/src/utils/common-utils.ts#L318-L356
  public setMockVariant = async (payload: RouteVariants) => {
    const url = `http://localhost:${this.port}${MEZZO_API_PATH}/routeVariants/set`;
    await axios.post(url, payload);
  };

  public setMockVariantForSession = async (
    sessionId: string,
    payload: RouteVariants
  ) => {
    const url = `http://localhost:${this.port}${MEZZO_API_PATH}/sessionVariantState/set/${sessionId}`;
    await axios.post(url, payload);
  };

  public updateMockVariantForSession = async (
    sessionId: string,
    payload: RouteVariants
  ) => {
    const url = `http://localhost:${this.port}${MEZZO_API_PATH}/sessionVariantState/update/${sessionId}`;
    await axios.post(url, payload);
  };

  public serialiazeRoutes = (): GetMezzoRoutes => {
    const routes: GetMezzoRoutesRouteData[] = this.userRoutes.map((route) => {
      const variantRetVal: GetMezzoRoutesVariantData[] = [];

      // add default variant
      variantRetVal.push({
        id: 'default',
      });

      // add route specific variants
      route.getVariants().forEach((value, key) => {
        variantRetVal.push({
          id: key,
          label: value.label,
        });
      });

      return {
        id: route.id,
        method: route.method,
        path: route.path,
        variants: variantRetVal,
        activeVariant: route.getActiveVariant(),
      };
    });
    return {
      routes,
    };
  };
}

export default new Mezzo();
