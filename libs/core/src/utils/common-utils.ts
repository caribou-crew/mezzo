import { Request, Response } from 'express';
import { RouteModel } from '../types';
import { getFileContentsForRequest } from './filePathUtils';
import logger from './logger';

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

    const fileContents = await getFileContentsForRequest(req);
    res.json(JSON.parse(fileContents));
  };
}
