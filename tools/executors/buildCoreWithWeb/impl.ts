// npx tsc tools/executors/buildCoreWithWeb/impl

import { ExecutorContext, runExecutor } from '@nrwl/devkit';
import * as fs from 'fs';
import * as path from 'path';

export interface ExecutorOptions {}

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

const deleteFolderRecursive = function (directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};

export default async function buildExecutor(
  options: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.log('Running admin-web to core executor');

  // Skip build as I can just do copy now that baseHref is the same indev
  /*
  const buildClient = await runExecutor(
    { project: 'admin-web', target: 'build' },
    options,
    // { envFile: '.env.prod' },
    context
  );

  for await (const result of buildClient) {
    if (!result.success) {
      return result;
    }
  }

  const buildLib = await runExecutor(
    {
      project: 'core',
      target: 'build',
    },
    {
      buildableProjectDepsInPackageJsonType: 'dependencies',
      envFile: '.env.prod',
    },
    context
  );

  for await (const result of buildLib) {
    if (!result.success) {
      return result;
    }
  }
  */

  copyRecursiveSync(
    './dist/apps/admin-web',
    './dist/libs/core-server/src/public' // TODO this may have to change based on how app is built
  );

  // delete dist/core-server/src/resources (2mb of unnecessary dev)
  deleteFolderRecursive('./dist/libs/core-server/src/resources');

  return { success: true };
}
