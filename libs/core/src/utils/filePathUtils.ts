import { Route } from '../models/route-model';
import logger from './logger';
import * as path from 'path';
import * as util from 'util';
import { Request } from 'express';

export interface Variant {
  id: string;
}
const fileExtensionOrder = ['.json', '.html', '.txt'];

const filterActiveVariantsFromDirectory = async (
  fs: any,
  dirLocation: string,
  variant?: string
): Promise<string[]> => {
  const readDir = util.promisify(fs.readdir);
  const filesInDir = await readDir(dirLocation);
  logger.debug('Files in dir: ', filesInDir);
  return filesInDir.filter((name) => name.match(variant));
};

export const getFileContentsForRequest = async (
  // activeVariant: string,
  route: Route,
  req: Request | null,
  fs: any,
  mockedDirectory: string
) => {
  console.log('Got path of: ', route.path);
  const endpoint = route.path.toString();

  const fileDir = path.join(
    mockedDirectory,
    endpoint,
    route.method.toUpperCase()
  );
  const variantId = route.getActiveVariantId(req);

  logger.debug('Route Method: ', route.method);
  logger.debug('Path: ', route.path);
  logger.debug('Variant: ', variantId);

  const activeVariantFiles = await filterActiveVariantsFromDirectory(
    fs,
    fileDir,
    variantId
  );
  logger.debug('Found variant matched files to use: ', activeVariantFiles);

  let fileToUse;
  if (activeVariantFiles.length === 0) {
    logger.error(`No files found at ${fileDir}`);
  } else if (activeVariantFiles.length === 1) {
    fileToUse = activeVariantFiles[0];
  } else {
    fileExtensionOrder.some((fileExtension) => {
      const fileIndex = activeVariantFiles.indexOf(
        `${variantId}${fileExtension}`
      );
      if (fileIndex >= 0) {
        fileToUse = activeVariantFiles[fileIndex];
        return true;
      }
      return false;
    });
  }
  logger.debug('Using file', fileToUse);
  const filePath = path.join(fileDir, fileToUse);
  logger.debug('Full path: ', filePath);

  const readFile = util.promisify(fs.readFile);
  const rawFileData = await readFile(filePath, 'utf-8');
  return {
    rawFileData,
    mimeType: path.extname(filePath),
  };
};
