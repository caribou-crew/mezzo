import { Route } from '../models/route-model';
import logger from '@caribou-crew/mezzo-utils-logger';
import * as path from 'path';
import * as util from 'util';
import * as nodeFs from 'fs';
import { Request } from 'express';
import { FileHandlerOptions } from '../../types';

export interface Variant {
  id: string;
}
const fileExtensionOrder = ['.json', '.html', '.txt'];

const filterActiveVariantsFromDirectory = async (
  fs: typeof nodeFs,
  dirLocation: string,
  variant?: string
): Promise<string[]> => {
  const readDir = util.promisify(fs.readdir);
  const filesInDir = await readDir(dirLocation);
  logger.debug('Available variant files: ', filesInDir);
  return filesInDir.filter((name) => name.match(variant));
};

export const getFilePathForRequest = async (
  fs: typeof nodeFs,
  mockedDirectory: string,
  route: Route,
  req: Request | null,
  options: FileHandlerOptions
) => {
  const userSpecifiedBaseDir = options?.baseDir;
  const userSpecifiedFileToUse = options?.filePath;

  let filePath;

  if (userSpecifiedFileToUse) {
    logger.debug(
      `respondWithFile blindly returning user defined <mockedDirectory>${userSpecifiedFileToUse}`
    );
    filePath = path.join(mockedDirectory, userSpecifiedFileToUse);
  } else {
    const baseDir = options?.baseDir || route.path.toString();

    const fileDir = path.join(
      mockedDirectory,
      baseDir,
      route.method.toUpperCase()
    );
    const variantId = route.getActiveVariantId(req);
    logger.debug(`respondWithFile
    Base Dir: <mockedDirectory>${baseDir} ${
      userSpecifiedBaseDir ? `(User Specified)` : ''
    }
    Filtering on variant: ${variantId}`);

    const activeVariantFiles = await filterActiveVariantsFromDirectory(
      fs,
      fileDir,
      variantId
    );

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
    filePath = path.join(fileDir, fileToUse);
    logger.debug(`Fulfilling with: ${filePath}`);
  }
  return {
    filePath,
    mimeType: path.extname(filePath),
  };
};

export const getFileContents = async (fs: typeof nodeFs, filePath: string) => {
  const readFile = util.promisify(fs.readFile);
  const rawFileData = await readFile(filePath, 'utf-8');
  return rawFileData;
};
