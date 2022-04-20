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
      mezzo
        .route({
          id: 'GET /route1',
          path: '/route1',
          handler: function (req, res) {
            res.json({ someKey: 'A' });
          },
        })
        .variant({
          id: 'variant1',
          handler: function (req, res) {
            res.json({ someKey: 'B' });
          },
        });
      mezzo.route({
        id: 'POST /route2',
        path: '/route2',
        method: 'POST',
        handler: function (req, res) {
          res.json({ someKey: 'C' });
        },
      });
      mezzo.route({
        id: 'GET /route3',
        path: '/route3',
        method: 'GET',
        handler: function (req, res) {
          res.json({ someKey: 'D' });
        },
      });
      mezzo.route({
        id: 'PUT /route4',
        path: '/route4',
        method: 'PUT',
        handler: function (req, res) {
          res.json({ someKey: '4' });
        },
      });
      mezzo.route({
        id: 'DELETE /route5',
        path: '/route5',
        method: 'DELETE',
        handler: function (req, res) {
          res.json({ someKey: '5' });
        },
      });
      mezzo.route({
        id: 'PATCH /route6',
        path: '/route6',
        method: 'PATCH',
        handler: function (req, res) {
          res.json({ someKey: '6' });
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
    }
  })();
}
