import { Route } from '../models/route-model';
import logger from './logger';
// import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { raw, Request } from 'express';
import { resourcesPath } from './pathHelpers';

export interface Variant {
  id: string;
}
const fileExtensionOrder = ['.json', '.html', '.txt'];

export const getFileContentsForRequest = async (
  // activeVariant: string,
  route: Route,
  req: Request | null,
  fs: any,
  mockedDirectory: string
) => {
  console.log('Got path of: ', route.path);
  const endpoint = route.path.toString();

  const filePath = path.join(
    mockedDirectory,
    endpoint,
    route.method.toUpperCase(),
    `${route.getActiveVariantId(req)}.json`
  );
  logger.debug('Reading File: ', filePath);
  const readFile = util.promisify(fs.readFile);
  const rawFileData = await readFile(filePath, 'utf-8');
  return rawFileData;
};
