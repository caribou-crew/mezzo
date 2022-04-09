import { Request, Response } from 'express';
import { Route } from '../models/route-model';
import { FileHandlerOptions } from '../types';
import { getFileContentsForRequest } from './filePathUtils';
import logger from './logger';
import { timeout } from './timeoutUtils';

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
    req: Request | null,
    res: Response,
    options?: FileHandlerOptions
  ) => {
    logger.debug(
      `respond with file for ${route?.method} at ${route?.path} of id ${route?.id}`
    );
    if (route == null) {
      return res.status(500).send('Route must be defined to respond from file');
      // throw new Error('Route must be defined to respond from file');
      // return;
    }

    // This works for non-dynamic URL paths, hence we need ID approach
    // const foundRoute = findRoute(req.method, req.path, this._routes);

    // TODO identify why route is coming in as null, we need route ID w/out user redefining it
    // const foundRoute = findRouteById(route.id, this._routes);

    // logger.debug(`About to read file, active variant: ${route.activeVariant}`);
    const fileContents = await getFileContentsForRequest(
      route,
      req,
      this._fs,
      this._mockedDirectory
    );
    await timeout(options?.delay ?? 0);
    res.json(JSON.parse(fileContents));
  };

  // This one is backwards compatible
  public respondWithFileLegacy = async (
    route: Route,
    res: Response,
    options?: FileHandlerOptions
  ) => {
    this.respondWithFile(route, null, res, options);
  };
}
