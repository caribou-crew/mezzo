import { Route } from '../models/route-model';
import logger from './logger';
// import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { raw, Request } from 'express';
import { resourcesPath } from './pathHelpers';

// TODO
export interface Variant {
  id: string;
}
// export interface FileHandlerInput {
//   options: FileHandlerOptions;
//   //   h: Hapi.ResponseToolkit;
//   route: typeof Route;
//   variant: Variant;
// }

const fileExtensionOrder = ['.json', '.html', '.txt'];

// export const readFile = util.promisify(fs.readFile);
// const readDir = util.promisify(fs.readdir);
// const exists = util.promisify(fs.exists);

export const getFileContentsForRequest = async (
  // req: Request,
  // activeVariant: string,
  route: Route,
  fs: any,
  mockedDirectory: string
) => {
  console.log('Got path of: ', route.path);
  const endpoint = route.path.toString();

  const filePath = path.join(
    mockedDirectory,
    endpoint,
    route.method.toUpperCase(),
    `${route.activeVariant}.json`
  );
  logger.debug('Reading File: ', filePath);
  const readFile = util.promisify(fs.readFile);
  const rawFileData = await readFile(filePath, 'utf-8');
  return rawFileData;
};
