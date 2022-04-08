import { createServer, Server } from 'http';
import logger from '../utils/logger';

import { CommonUtils } from '../utils/common-utils';
import { MiddlewareFn, RouteData, ServerOptions } from '../types';
import * as express from 'express';
import { Route } from '../models/route-model';
import { addAdminEndpoints, addAdminStaticSite } from './admin';
import {
  findRoute,
  findRouteById,
  findRouteIndex,
  findRouteIndexById,
} from '../utils/routeMatchingUtils';
import * as fsDefault from 'fs';

// function mezzo() {
//   const userRoutes: RouteModel[] = [];
//   let server: Server;
//   let app: express.Express;
//   let fs;
//   let util;

//   const _resetRouteState = () => (userRoutes.length = 0);

//   const _addRouteToExpress = (myRoute: RouteModel) => {
//     app[myRoute.method.toLowerCase()](myRoute.path, <MiddlewareFn>((
//       req,
//       res,
//       next
//     ) => {
//       myRoute.processRequest(req, res, next);
//     }));
//   };

//   const _addRouteToState = (myRoute: RouteModel) => {
//     userRoutes.push(myRoute);
//   };

//   const start = async (options?: ServerOptions): Promise<Server> => {
//     app = express();
//     _resetRouteState();
//     addAdminEndpoints(app);
//     addAdminStaticSite(app, options);
//     fs = options?.fsOverride ?? fsDefault;
//     util = new CommonUtils(userRoutes, fs);
//     // if (options.fsOverride) {
//     //   fs = options.fsOverride;
//     // }

//     return new Promise((resolve) => {
//       const port = options?.port ?? 8000;
//       server = createServer(app).listen(port, () => {
//         logger.debug(
//           `***************Server running on port ${port} ***************`
//         );
//         resolve(server);
//       });
//     });
//   };

//   const stop = async (serverArg?: Server) => {
//     const serverToStop = serverArg ?? server;
//     return new Promise((resolve) => {
//       if (serverToStop) {
//         logger.debug(
//           '***************Stopping Mezzo mocking server ***************'
//         );
//         serverToStop.close(resolve);
//         app = undefined;
//       } else {
//         logger.warn(
//           '***************Unable to stop Mezzo mocking server ***************'
//         );
//         resolve(null);
//       }
//     });
//   };

//   /**
//    * Add route to mock server
//    * @param routeData
//    * @returns
//    */
//   const route = (routeData: RouteData): RouteModel => {
//     if (app == undefined) {
//       logger.error(
//         'You have not yet initialied the app, please start before adding routes'
//       );
//       throw new Error('App not yet initialized');
//     }
//     const myRoute = Route(routeData);
//     _addRouteToExpress(myRoute);
//     _addRouteToState(myRoute);

//     return myRoute;
//   };

//   const setMockVariant = (method: string, path: string, variantId: string) => {
//     const index = findRouteIndex(method, path, userRoutes);
//     const foundRoute = userRoutes[index];
//     console.log('Inside set mock variant', foundRoute);
//     if (foundRoute) {
//       // TODO log if variant cannot be set

//       // this is not actually updating entry in global state
//       const updatedItem = foundRoute.setVariant(variantId);

//       // So make sure to update hte array item
//       userRoutes[index] = updatedItem;

//       logger.info(`Set variant complete: ${foundRoute.activeVariant}`);
//     } else {
//       console.warn(
//         `Could not find route for ${method} ${path} to set variant ${variantId}`
//       );
//     }
//   };

//   return {
//     start,
//     stop,
//     route,
//     routes: userRoutes,
//     // util: new CommonUtils(userRoutes, fs),
//     util,
//     setMockVariant,
//   };
// }

// export default mezzo();

class Mezzo {
  public userRoutes: Route[] = [];
  private server: Server;
  private app: express.Express;
  private fs;
  public util: CommonUtils;
  public mockedDirectory;

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

  public start = async (options?: ServerOptions): Promise<Server> => {
    this.app = express();
    this._resetRouteState();
    addAdminEndpoints(this.app);
    addAdminStaticSite(this.app, options);
    this.fs = options?.fsOverride ?? fsDefault;
    this.mockedDirectory = options.mockedDirectory;
    this.util = new CommonUtils(this.userRoutes, this.fs, this.mockedDirectory);
    // if (options.fsOverride) {
    //   fs = options.fsOverride;
    // }

    return new Promise((resolve) => {
      const port = options?.port ?? 8000;
      this.server = createServer(this.app).listen(port, () => {
        logger.debug(
          `***************Server running on port ${port} ***************`
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
    const myRoute = new Route(routeData);
    this._addRouteToExpress(myRoute);
    this._addRouteToState(myRoute);

    return myRoute;
  };

  public setMockVariant = (routeId: string, variantId: string) => {
    // const index = findRouteIndex(method, path, this.userRoutes);
    const index = findRouteIndexById(routeId, this.userRoutes);
    const foundRoute = this.userRoutes[index];
    // console.log('Inside set mock variant', foundRoute);
    if (foundRoute) {
      // TODO log if variant cannot be set

      // this is not actually updating entry in global state
      const updatedItem = foundRoute.setVariant(variantId);

      // So make sure to update hte array item
      this.userRoutes[index] = updatedItem;

      logger.info(`Set variant complete: ${foundRoute.activeVariant}`);
    } else {
      console.warn(
        `Could not find route for ${routeId} to set variant ${variantId}`
      );
    }
  };
}

export default new Mezzo();
