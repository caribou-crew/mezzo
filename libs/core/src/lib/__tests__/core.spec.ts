import * as SuperTestRequest from 'supertest';
import { fs, vol } from 'memfs';
import mezzo from '../core';
import * as path from 'path';
import { resourcesPath } from '../../utils/pathHelpers';
import logger from '../../utils/logger';

describe('mezzo', () => {
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;
  beforeAll(() => {
    global.console = require('console'); // Don't stack trace out all console logs
  });

  let mockedDirectory;
  beforeEach(async () => {
    process.env.LOG_LEVEL = 'warn';
    const port = 3000;
    request = SuperTestRequest(`http://localhost:${port}`);
    mockedDirectory = path.join(resourcesPath, 'some-custom-mocked-data');
    await mezzo.start({
      port,
      mockedDirectory,
      fsOverride: fs,
    });
  });
  afterEach(async () => {
    await mezzo.stop();
    vol.reset();
  });

  describe('.route', () => {
    describe('file response', () => {
      it('should read from default file using backwards compatible handler', async () => {
        vol.fromJSON(
          {
            './respondWithFile/GET/default.json':
              '{"message": "Responding with file"}',
          },
          mockedDirectory
        );
        mezzo.route({
          id: 'someRoute',
          path: '/respondWithFile',
          handler(req, res) {
            return mezzo.util.respondWithFile(this, res);
          },
        });
        const res = await request.get('/respondWithFile');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Responding with file' });
      });
      it('cannot read file using handler with fat arrow function (likely unexpected behavior to users)', async () => {
        vol.fromJSON(
          {
            './respondWithFile/GET/default.json':
              '{"message": "Responding with file"}',
          },
          mockedDirectory
        );
        mezzo.route({
          id: 'someRoute',
          path: '/respondWithFile',
          handler: (req, res) => {
            // Based on how scoping of `this` works, if you put it inside a fat arrow function it'll break the reference of this
            return mezzo.util.respondWithFile(this, res);
          },
        });
        const res = await request.get('/respondWithFile');
        expect(res.status).toBe(500);
      });
      it('should read from default file using explicit callback', async () => {
        vol.fromJSON(
          {
            './respondWithFile/GET/default.json':
              '{"message": "Responding with file"}',
          },
          mockedDirectory
        );
        mezzo.route({
          id: 'someRoute',
          path: '/respondWithFile',
          callback: (req, res, route) => {
            return mezzo.util.respondWithFile(route, res);
          },
        });
        const res = await request.get('/respondWithFile');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Responding with file' });
      });
      it('should read from variant file', async () => {
        vol.fromJSON(
          {
            './respondWithVariantReplyFromFile/GET/default.json':
              '{"variant": "default"}',
            './respondWithVariantReplyFromFile/GET/variant1.json':
              '{"variant": "variant1"}',
          },
          mockedDirectory
        );
        const myPath = '/respondWithVariantReplyFromFile';
        mezzo
          .route({
            id: 'someRoute',
            path: myPath,
            handler(req, res) {
              return mezzo.util.respondWithFile(this, res);
            },
          })
          .variant({
            id: 'variant1',
            handler(req, res) {
              return mezzo.util.respondWithFile(this, res);
            },
          });
        const res = await request.get(myPath);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ variant: 'default' });

        mezzo.setMockVariant('GET', myPath, 'variant1');

        const res2 = await request.get(myPath);
        expect(res2.body).toEqual({ variant: 'variant1' });
      });
      it("handler's this and route are the same", async () => {
        const path = '/part1';
        let insideThis;
        const route = mezzo.route({
          id: 'someRoute',
          path,
          handler(req, res) {
            insideThis = this;
            res.sendStatus(200);
          },
        });
        await request.get(path);
        expect(route).toBe(insideThis);
      });
      it.skip('should read file with dynamic path', async () => {
        vol.fromJSON(
          {
            './part1/:part2/GET/default.json': '{"variant": "default"}',
          },
          mockedDirectory
        );
        const path = '/part1/:part2';
        // const route = mezzo.route({
        mezzo.route({
          id: 'someRoute',
          path,
          handler(req, res, next) {
            // logger.debug('Value (route) inside handler: ', route);
            return mezzo.util.respondWithFile(this, res);
          },
        });
        // logger.debug(
        //   'Console.log value of route after full instantiation: ',
        //   route
        // );
        const res = await request.get('/part1/someDynamicPart2Path');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ variant: 'default' });
      });
      it.skip('should read session scoped variant from file TODO', async () => {});
      it.skip('should read header scoped variant from file TODO', async () => {});
    });
    describe('express response', () => {
      describe('with regexp', () => {
        it('should read from default file with regex in path', async () => {
          mezzo.route({
            id: 'someRoute',
            path: /.*fly$/,
            handler: (req, res) => {
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
            id: 'someRoute',
            path: '/docs/:stuff',
            handler: (req, res) => {
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
            id: 'someRoute',
            path: /docs\/termsAndConditions_(.*)_(.*)\.json$/,
            handler: (req, res) => {
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
          id: 'someRoute',
          method: 'GET',
          path: '/respondWithCustomCoding',
          handler: function (req, res) {
            res.send({ someCustomCodingResponse: true });
          },
        });

        const res = await request.get('/respondWithCustomCoding');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ someCustomCodingResponse: true });
      });

      it('should work with dynamic path', async () => {
        mezzo.route({
          id: 'someRoute',
          path: '/:someDynamicValue',
          handler: (req, res) => {
            res.json({ someCustomCodingResponse: 'hi' });
          },
        });
        const res = await request.get('/someDynamicEndpoint');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ someCustomCodingResponse: 'hi' });
      });
      it('should allow custom status codes', async () => {
        mezzo.route({
          id: 'someRoute',
          method: 'GET',
          path: '/respondWithCustomCodingAndStatus',
          handler: function (req, res) {
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
            handler: function (req, res) {
              console.log('Got request for default!!!');
              res.json({ someKey: 'A' });
            },
          })
          .variant({
            id: 'someVariantId',
            handler: function (req, res) {
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
          handler: function (req, res) {
            console.log('Got request for default!!!');
            res.json({ someKey: 'A' });
          },
        });
        someRoute
          .variant({
            id: 'someVariantId',
            handler: function (req, res) {
              console.log('Got request for variant!!!');
              res.json({ someKey: 'B' });
            },
          })
          .variant({
            id: 'someVariantC',
            handler: function (req, res) {
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
          handler: function (req, res) {
            res.json({ someKey: 'A' });
          },
        })
        .variant({
          id: altVariantName,
          handler: function (req, res) {
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
