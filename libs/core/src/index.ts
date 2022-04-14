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
    // mocked route
    // mezzo
    //   .route({
    //     id: 'GET /route1',
    //     path: '/route1',
    //     handler: function (req, res) {
    //       res.json({ someKey: 'A' });
    //     },
    //   })
    //   .variant({
    //     id: 'variant1',
    //     handler: function (req, res) {
    //       res.json({ someKey: 'B' });
    //     },
    //   });
    // mezzo.route({
    //   id: 'POST /route2',
    //   path: '/route2',
    //   method: 'POST',
    //   handler: function (req, res) {
    //     res.json({ someKey: 'C' });
    //   },
    // });
    // mezzo.route({
    //   id: 'POST /route3',
    //   path: '/route3',
    //   method: 'GET',
    //   handler: function (req, res) {
    //     res.json({ someKey: 'D' });
    //   },
    // });
    // mezzo.route({
    //   id: 'POST /route4',
    //   path: '/route4',
    //   method: 'PUT',
    //   handler: function (req, res) {
    //     res.json({ someKey: '4' });
    //   },
    // });
    // mezzo.route({
    //   id: 'POST /route5',
    //   path: '/route5',
    //   method: 'DELETE',
    //   handler: function (req, res) {
    //     res.json({ someKey: '5' });
    //   },
    // });
    // mezzo.route({
    //   id: 'POST /route6',
    //   path: '/route6',
    //   method: 'PATCH',
    //   handler: function (req, res) {
    //     res.json({ someKey: '6' });
    //   },
    // });
  })();
}
