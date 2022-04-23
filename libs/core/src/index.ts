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
      mockedDirectory,
      adminEndpoint: 'mezzo',
    });

    if (process.env.NODE_ENV === 'development') {
      mezzo.log.setLogLevel('debug');
      const dynamicFeed = { name: 'dynamic_feed' };
      const link = { name: 'link' };
      const database = { name: 'storage' };
      mezzo
        .route({
          id: 'GET /api/food/meat',
          path: '/api/food/meat',
          titleIcons: [
            {
              name: 'github',
              link: 'https://github.com/caribou-crew/mezzo',
              color: 'action',
            },
          ],
          icons: [database, dynamicFeed, link],
          handler: function (req, res) {
            res.json({ someKey: 'A' });
          },
        })
        .variant({
          id: 'variant1',
          icons: [database],
          handler: function (req, res) {
            res.json({ someKey: 'B' });
          },
        })
        .variant({
          id: 'variant2',
          handler: function (req, res) {
            res.json({ someKey: 'C' });
          },
        })
        .variant({
          id: 'variant3',
          handler: function (req, res) {
            res.json({ someKey: 'D' });
          },
        })
        .variant({
          id: 'variant4',
          handler: function (req, res) {
            res.json({ someKey: 'E' });
          },
        })
        .variant({
          id: 'variant5',
          handler: function (req, res) {
            res.json({ someKey: 'F' });
          },
        })
        .variant({
          id: 'variant6',
          handler: function (req, res) {
            res.json({ someKey: 'G' });
          },
        })
        .variant({
          id: 'variant7',
          handler: function (req, res) {
            res.json({ someKey: 'H' });
          },
        })
        .variant({
          id: 'variant8',
          handler: function (req, res) {
            res.json({ someKey: 'I' });
          },
        });
      mezzo
        .route({
          id: 'POST /api/food/drink',
          path: '/api/food/drink',
          method: 'POST',
          handler: function (req, res) {
            res.json({ someKey: 'C', someOtherKey: 'D', yetAnotherKey: 'E' });
          },
        })
        .variant({
          id: 'variant-with-a-very-descriptive-name-for-testing-purposes',
          handler: function (req, res) {
            res.json({ someKey: 'I' });
          },
        });
      mezzo.route({
        id: 'GET /api/food/drink/water',
        path: '/api/food/drink/water',
        method: 'GET',
        handler: function (req, res) {
          res.json({ someKey: 'D' });
        },
      });
      mezzo.route({
        id: 'PUT /api/food/drink/milk',
        path: '/api/food/drink/milk',
        method: 'PUT',
        handler: function (req, res) {
          res.json({ someKey: '4' });
        },
      });
      mezzo.route({
        id: 'DELETE /api/food/fruit',
        path: '/api/food/fruit',
        method: 'DELETE',
        handler: function (req, res) {
          res.json({ someKey: '5' });
        },
      });
      mezzo.route({
        id: 'PATCH /api/food/fruit/orange',
        path: '/api/food/fruit/orange',
        method: 'PATCH',
        handler: function (req, res) {
          res.json({ someKey: '6' });
        },
      });
      mezzo
        .route({
          id: 'GET /api/food/fruit/orange/serviceHandler/otherInformation/excessivelylongroutename',
          path: '/api/food/fruit/orange/serviceHandler/otherInformation/excessivelylongroutename',
          method: 'GET',
          handler: function (req, res) {
            res.json({ someKey: '7' });
          },
        })
        .variant({
          id: 'variant-with-a-very-descriptive-name-for-testing-purposes',
          handler: function (req, res) {
            res.json({ someKey: 'I' });
          },
        });
      mezzo.route({
        id: 'GET /respondWithJSONFile',
        path: '/respondWithJSONFile',
        method: 'GET',
        callback: function (req, res, route) {
          mezzo.util.respondWithFile(route, req, res);
        },
      });
      mezzo.route({
        id: 'GET /respondWithTXTFile',
        path: '/respondWithTXTFile',
        method: 'GET',
        callback: function (req, res, route) {
          mezzo.util.respondWithFile(route, req, res);
        },
      });
      mezzo.route({
        id: 'GET /respondWithPNGFile',
        path: '/respondWithPNGFile',
        method: 'GET',
        callback: function (req, res, route) {
          mezzo.util.respondWithFile(route, req, res);
        },
      });
      mezzo.route({
        id: 'GET /respondWithHTMLFile',
        path: '/respondWithHTMLFile',
        method: 'GET',
        callback: function (req, res, route) {
          mezzo.util.respondWithFile(route, req, res);
        },
      });
      mezzo.route({
        id: 'GET /respondWithPDFFile',
        path: '/respondWithPDFFile',
        method: 'GET',
        callback: function (req, res, route) {
          mezzo.util.respondWithFile(route, req, res);
        },
      });
      mezzo.route({
        id: 'GET /respondWithGIFFile',
        path: '/respondWithGIFFile',
        method: 'GET',
        callback: function (req, res, route) {
          mezzo.util.respondWithFile(route, req, res);
        },
      });
      mezzo.route({
        id: 'GET /respondWithSVGFile',
        path: '/respondWithSVGFile',
        method: 'GET',
        callback: function (req, res, route) {
          mezzo.util.respondWithFile(route, req, res);
        },
      });

      mezzo.addGlobalVariant({
        id: '500',
        label: '500 error',
        callback: function (req, res) {
          res.sendStatus(500);
        },
      });
    }
  })();
}
