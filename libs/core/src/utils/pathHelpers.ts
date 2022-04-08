import * as path from 'path';
// export const toPosix = (somePath) =>
//   somePath.split(path.sep).join(path.posix.sep);
export const appRoot = path.resolve(__dirname, '../..');
export const resourcesPath = path.resolve(appRoot, 'src', 'resources');
