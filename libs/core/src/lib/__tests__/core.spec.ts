import * as SuperTestRequest from 'supertest';

import { Server } from 'http';
import {
  getTestServer,
  getSuperTest,
  stopTestServer,
  getMezzo,
} from '../../__tests__/testHelper';
import mezzoObject from '../../index';

describe('mezzo', () => {
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;
  let server: Server;
  let mezzo: typeof mezzoObject;
  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      // Suppress console logging during test
    });
    process.env.LOG_LEVEL = 'warn';
    server = await getTestServer();
    request = getSuperTest();
    mezzo = getMezzo();
    // require('../resources/endpoints');
  });
  afterEach(async () => {
    await stopTestServer(server);
  });

  describe('.route', () => {
    describe('file response', () => {
      it('should read from default file', async () => {
        mezzo.route({
          path: '/respondWithFile',
          callback: (req, res) => {
            return mezzo.util.respondWithFile(req, res);
          },
        });
        const res = await request.get('/respondWithFile');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Responding with file' });
      });
      it.skip('should read from variant file TODO', async () => {});
      it.skip('should read session scoped variant from file TODO', async () => {});
      it.skip('should read header scoped variant from file TODO', async () => {});
    });
    describe('express response', () => {
      describe('with regexp', () => {
        it('should read from default file with regex in path', async () => {
          mezzo.route({
            path: /.*fly$/,
            callback: (req, res) => {
              res.json({ message: 'hi' });
            },
          });
          const res = await request.get('/butterfly');
          expect(res.status).toBe(200);
          expect(res.body).toEqual({ message: 'hi' });

          const res2 = await request.get('/flyNot');
          expect(res2.status).toBe(404);
        });
        it('should be able to extrac parameters from url', async () => {
          let stuff;
          mezzo.route({
            path: '/docs/:stuff',
            callback: (req, res) => {
              res.json({ message: 'hi' });
              stuff = req.params.stuff;
            },
          });
          await request.get('/docs/someStuff');
          expect(stuff).toEqual('someStuff');
        });
        it('should be able to extrac parameters from regex', async () => {
          let params;
          mezzo.route({
            path: /docs\/termsAndConditions_(.*)_(.*)\.json$/,
            callback: (req, res) => {
              params = req.params;
              res.json({ message: 'hi' });
            },
          });
          await request.get(
            '/docs/termsAndConditions_platformA_version1.2.3.json'
          );
          expect(params['0']).toEqual('platformA');
          expect(params['1']).toEqual('version1.2.3');
        });
      });
      it('should use default resopnse', async () => {
        mezzo.route({
          method: 'GET',
          path: '/respondWithCustomCoding',
          callback: function (req, res) {
            res.send({ someCustomCodingResponse: true });
          },
        });

        const res = await request.get('/respondWithCustomCoding');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ someCustomCodingResponse: true });
      });

      it('should work with dynamic path', async () => {
        mezzo.route({
          path: '/:someDynamicValue',
          callback: (req, res) => {
            res.json({ someCustomCodingResponse: 'hi' });
          },
        });
        const res = await request.get('/someDynamicEndpoint');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ someCustomCodingResponse: 'hi' });
      });
      it('should allow custom status codes', async () => {
        mezzo.route({
          method: 'GET',
          path: '/respondWithCustomCodingAndStatus',
          callback: function (req, res) {
            res.status(401).json({ someCustomError: true });
          },
        });
        const res = await request.get('/respondWithCustomCodingAndStatus');
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ someCustomError: true });
      });
      it('should be able to directly set the variant from the route', async () => {
        const someRoute = mezzo
          .route({
            id: 'GET /some/path',
            path: '/some/path',
            callback: function (req, res) {
              console.log('Got request for default!!!');
              res.json({ someKey: 'A' });
            },
          })
          .variant({
            id: 'someVariantId',
            callback: function (req, res) {
              console.log('Got request for variant!!!');
              res.json({ someKey: 'B' });
            },
          });

        someRoute.setVariant('someVariantId');
        const res2 = await request.get('/some/path');
        expect(res2.body).toEqual({ someKey: 'B' });
      });
      it('should be able to change the variant multiple times', async () => {
        const someRoute = mezzo.route({
          id: 'GET /some/path',
          path: '/some/path',
          callback: function (req, res) {
            console.log('Got request for default!!!');
            res.json({ someKey: 'A' });
          },
        });
        someRoute
          .variant({
            id: 'someVariantId',
            callback: function (req, res) {
              console.log('Got request for variant!!!');
              res.json({ someKey: 'B' });
            },
          })
          .variant({
            id: 'someVariantC',
            callback: function (req, res) {
              res.json({ someKey: 'C' });
            },
          });
        const res = await request.get('/some/path');
        expect(res.body).toEqual({ someKey: 'A' });

        someRoute.setVariant('someVariantId');
        const res2 = await request.get('/some/path');
        expect(res2.body).toEqual({ someKey: 'B' });

        someRoute.setVariant('someVariantC');
        const res3 = await request.get('/some/path');
        expect(res3.body).toEqual({ someKey: 'C' });
      });
      it.skip('should read session scoped variant from code TODO', async () => {});
      it.skip('should read header scoped variant from code TODO', async () => {});
    });
  });

  describe('.setMockVariant', () => {
    it('should change the active variant of route', async () => {
      const myPath = '/some/path';
      const altVariantName = 'someVariantB';
      mezzo
        .route({
          id: `GET ${myPath}`,
          path: myPath,
          callback: function (req, res) {
            res.json({ someKey: 'A' });
          },
        })
        .variant({
          id: altVariantName,
          callback: function (req, res) {
            res.json({ someKey: 'B' });
          },
        });
      const res = await request.get(myPath);
      expect(res.body).toEqual({ someKey: 'A' });

      mezzo.setMockVariant('GET', myPath, altVariantName);
      const res2 = await request.get(myPath);
      expect(res2.body).toEqual({ someKey: 'B' });
    });
  });

  describe('/admin', () => {
    it('should have stubbed out admin site (move out of common)', async () => {
      const res = await request.get('/mezzo');
      expect(res.status).toBe(200);
      expect(res.text).toBe('TODO HTML Site');
    });
  });
});
