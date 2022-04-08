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
export interface FileHandlerInput {
  options: FileHandlerOptions;
  //   h: Hapi.ResponseToolkit;
  route: typeof Route;
  variant: Variant;
}

export interface FileHandlerOptions {
  code?: number;
  headers?: Record<string, string | boolean>;
  filePath?: string;
  delay?: number;
  cookies?: any;
  // TODO
  transpose?: any;
}

const fileExtensionOrder = ['.json', '.html', '.txt'];

// export const readFile = util.promisify(fs.readFile);
// const readDir = util.promisify(fs.readdir);
// const exists = util.promisify(fs.exists);

export const getFileContentsForRequest = async (
  req: Request,
  activeVariant: string,
  fs: any,
  mockedDirectory: string
) => {
  const endpoint = req.path.substring(1);

  const filePath = path.join(
    mockedDirectory,
    endpoint,
    req.method.toUpperCase(),
    `${activeVariant}.json`
  );
  logger.debug('Reading File: ', filePath);
  const readFile = util.promisify(fs.readFile);
  const rawFileData = await readFile(filePath, 'utf-8');
  return rawFileData;
};
