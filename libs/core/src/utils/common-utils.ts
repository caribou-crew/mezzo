import { Request, Response } from 'express';
import { RouteModel } from '../types';
import { getFileContentsForRequest } from './filePathUtils';
import logger from './logger';
import { findRoute } from './routeMatchingUtils';

export class CommonUtils {
  private _routes: RouteModel[];
  constructor(routes: RouteModel[]) {
    this._routes = routes;
  }
  /**
   *  Called by user defined routes in mezzo.utils.respondWithFile
   */
  public respondWithFile = async (req: Request, res: Response) => {
    logger.debug(`respond with file for ${req.method} at ${req.path}`);

    const method = req.method;
    const path = req.path;

    const foundRoute = findRoute(method, path, this._routes);
    if (foundRoute) {
      logger.debug(
        `About to read file, active variant: ${foundRoute.activeVariant}`
      );
      const fileContents = await getFileContentsForRequest(
        req,
        foundRoute.activeVariant
      );
      res.json(JSON.parse(fileContents));
    } else {
      logger.error(`No route found for ${method} and ${path}`);
      res.status(404);
    }
  };
}
