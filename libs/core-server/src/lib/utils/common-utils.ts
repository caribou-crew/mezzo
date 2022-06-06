import { Request, Response } from 'express';
import { Route } from '../models/routeModel';
import { FileHandlerOptions } from '../../types';
import { getFileContents, getFilePathForRequest } from './filePathUtils';
import logger from '@caribou-crew/mezzo-utils-logger';
import { timeout } from './timeoutUtils';
import * as nodeFs from 'fs';
import { RouteItemType, VariantItem } from '@caribou-crew/mezzo-interfaces';

export class CommonUtils {
  private _routes: Route[];
  private _fs: typeof nodeFs;
  private _mockedDirectory: string;

  constructor(routes: Route[], fs: typeof nodeFs, mockedDirectory: string) {
    this._routes = routes;
    this._fs = fs;
    this._mockedDirectory = mockedDirectory;
  }

  public serialiazeRoutes = (): RouteItemType[] => {
    const routes: RouteItemType[] = this._routes.map((route) => {
      const variantRetVal: VariantItem[] = [];

      // add default variant
      variantRetVal.push({
        id: 'default',
        icons: route.icons,
        category: route.category,
      });

      // add route specific variants
      route.getVariants().forEach((variant, key) => {
        variantRetVal.push({
          id: key,
          label: variant.label,
          icons: variant.icons,
          category: variant?.category,
        });
      });

      return {
        id: route.id,
        method: route.method,
        label: route.label,
        path: route.path,
        variants: variantRetVal,
        activeVariant: route.getActiveVariant(),
        titleIcons: route.titleIcons,
      };
    });
    return routes;
  };

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
      options
    );

    const sendTypes = ['.txt', '.html'];
    const imageTypes = ['.png', '.gif', '.pdf', '.jpg', '.jpeg', '.svg'];
    const statusCode = options?.code ?? 200;
    const headers = options?.headers ?? {};
    if (options?.delay ?? 0 > 0) {
      logger.debug('Waiting for a delay of ', options?.delay);
    }
    await timeout(options?.delay ?? 0);

    if (filePathInfo === null) {
      logger.error('Failed to parse content, returning erraneous 500');
      res.sendStatus(500);
    } else if (imageTypes.includes(filePathInfo.mimeType.toLowerCase())) {
      res.status(statusCode).header(headers).sendFile(filePathInfo.filePath);
    } else {
      const rawFileData = await getFileContents(
        this._fs,
        filePathInfo.filePath
      );
      if (filePathInfo.mimeType === '.json') {
        res.status(statusCode).header(headers).json(JSON.parse(rawFileData));
      } else if (sendTypes.includes(filePathInfo.mimeType.toLowerCase())) {
        res.status(statusCode).header(headers).send(rawFileData);
      } else {
        logger.warn(
          `Filetype ${filePathInfo.mimeType} not officially supported yet`
        );
        res.status(statusCode).header(headers).send(rawFileData);
      }
    }
  };
}
