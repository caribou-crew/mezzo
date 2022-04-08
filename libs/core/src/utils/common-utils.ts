import { Request, Response } from 'express';
import { Route } from '../models/route-model';
import { getFileContentsForRequest } from './filePathUtils';
import logger from './logger';
import { findRoute, findRouteById } from './routeMatchingUtils';

export class CommonUtils {
  private _routes: Route[];
  private _fs: any;
  private _mockedDirectory: string;
  constructor(routes: Route[], fs: any, mockedDirectory: string) {
    this._routes = routes;
    this._fs = fs;
    this._mockedDirectory = mockedDirectory;
  }
  /**
   *  Called by user defined routes in mezzo.utils.respondWithFile
   */
  public respondWithFile = async (
    route: Route,
    req: Request,
    res: Response
  ) => {
    logger.debug(
      `respond with file for ${req?.method} at ${req?.path} of id ${route?.id}`
    );
    if (route == null) {
      return res.status(500).send('Route must be defined to respond from file');
      // throw new Error('Route must be defined to respond from file');
      // return;
    }

    // This works for non-dynamic URL paths, hence we need ID approach
    // const foundRoute = findRoute(req.method, req.path, this._routes);

    // TODO identify why route is coming in as null, we need route ID w/out user redefining it
    const foundRoute = findRouteById(route.id, this._routes);

    if (foundRoute) {
      logger.debug(
        `About to read file, active variant: ${foundRoute.activeVariant}`
      );
      const fileContents = await getFileContentsForRequest(
        req,
        foundRoute.activeVariant,
        this._fs,
        this._mockedDirectory
      );
      res.json(JSON.parse(fileContents));
    } else {
      // logger.error(`No route found for ${route.method} and ${path}`);
      logger.error(`No route found for ${route.id}`);
      res.status(404);
    }
  };
}
