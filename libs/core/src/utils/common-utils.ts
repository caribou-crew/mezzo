import { Request, Response } from 'express';
import { Route } from '../models/route-model';
import { FileHandlerOptions } from '../types';
import { getFileContents, getFilePathForRequest } from './filePathUtils';
import logger from './logger';
import { timeout } from './timeoutUtils';
import * as nodeFs from 'fs';

export class CommonUtils {
  private _routes: Route[];
  private _fs: typeof nodeFs;
  private _mockedDirectory: string;
  constructor(routes: Route[], fs: typeof nodeFs, mockedDirectory: string) {
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
      `respond with file for ${route?.method} ${route?.path} of id ${route?.id}`
    );
    if (route == null) {
      return res.status(500).send('Route must be defined to respond from file');
      // throw new Error('Route must be defined to respond from file');
      // return;
    }

    const filePathInfo = await getFilePathForRequest(
      this._fs,
      this._mockedDirectory,
      route,
      req,
      options?.filePath
    );

    const sendTypes = ['.txt', '.html'];
    const imageTypes = ['.png', '.gif', '.pdf', '.jpg', '.jpeg', '.svg'];
    await timeout(options?.delay ?? 0);
    if (imageTypes.includes(filePathInfo.mimeType.toLowerCase())) {
      res.sendFile(filePathInfo.filePath);
    } else {
      const rawFileData = await getFileContents(
        this._fs,
        filePathInfo.filePath
      );
      if (filePathInfo.mimeType === '.json') {
        res.json(JSON.parse(rawFileData));
      } else if (sendTypes.includes(filePathInfo.mimeType.toLowerCase())) {
        res.send(rawFileData);
      } else {
        logger.warn(
          `Filetype ${filePathInfo.mimeType} not officially supported yet`
        );
        res.send(rawFileData);
      }
    }
  };
}
