// import * as mezzo from './lib/core';
import mezzo from './lib/core';
export default mezzo;
import * as path from 'path';
import { resourcesPath } from './utils/pathHelpers';

const [arg] = process.argv.slice(2);
if (arg === 'start') {
  const mockedDirectory = path.join(resourcesPath, 'mocked-data');
  (async () => {
    await mezzo.start({
      port: 8000,
      mockedDirectory, // TODO not yet implemented
      adminEndpoint: 'mezzo',
    });
  })();
}
