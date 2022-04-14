import * as SuperTestRequest from 'supertest';
import { fs, vol } from 'memfs';
import mezzo from '../core';
import * as path from 'path';
import { resourcesPath } from '../../utils/pathHelpers';
import { X_REQUEST_SESSION, X_REQUEST_VARIANT } from '../../utils/constants';

describe('route-file-io', () => {
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;
  beforeAll(() => {
    // global.console = require('console'); // Don't stack trace out all console logs
  });

  let mockedDirectory;
  const routePath = '/respondWithFile';
  const routeId = `GET ${routePath}`;

  const routePathVariant = '/respondWithVariantReplyFromFile';
  const routePathVariantId = `GET ${routePathVariant}`;

  const routePathDynamic = '/part1/:part2';
  const routePathDynamicId = `GET ${routePathDynamic}`;

  const variant1 = 'variant1';
  const variant2 = 'v2';
  const _default = 'default';
  const sessionId = '123';
  const expectedPayload = 'Responding with file';
  beforeEach(async () => {
    process.env.LOG_LEVEL = 'warn';
    const port = 3005;
    request = SuperTestRequest(`http://localhost:${port}`);
    mockedDirectory = path.join(resourcesPath, 'some-custom-mocked-data');
    await mezzo.start({
      port,
      mockedDirectory,
      fsOverride: fs,
    });

    vol.fromJSON(
      {
        './respondWithFile/GET/default.json': `{"message": "${expectedPayload}"}`,
        './respondWithVariantReplyFromFile/GET/default.json': `{"variant": "${_default}"}`,
        './respondWithVariantReplyFromFile/GET/variant1.json': `{"variant": "${variant1}"}`,
        './part1/:part2/GET/default.json': '{"variant": "default"}',
        './part1/:part2/GET/variant1.json': '{"variant": "other"}',
      },
      mockedDirectory
    );
  });
  afterEach(async () => {
    await mezzo.stop();
    vol.reset();
  });

  describe('file response', () => {
    it('should read from default file using backwards compatible handler', async () => {
      mezzo.route({
        id: routeId,
        path: routePath,
        handler(req, res) {
          return mezzo.util.respondWithFile(this, req, res);
        },
      });
      const res = await request.get(routePath);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: expectedPayload });
    });
    it('cannot read file using handler with fat arrow function (likely unexpected behavior to users)', async () => {
      mezzo.route({
        id: routeId,
        path: routePath,
        handler: (req, res) => {
          // Based on how scoping of `this` works, if you put it inside a fat arrow function it'll break the reference of this
          return mezzo.util.respondWithFile(this, req, res);
        },
      });
      const res = await request.get(routePath);
      expect(res.status).toBe(500);
    });
    it('should read from default file using explicit callback', async () => {
      mezzo.route({
        id: routeId,
        path: routePath,
        callback: (req, res, route) => {
          return mezzo.util.respondWithFile(route, req, res);
        },
      });
      const res = await request.get(routePath);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: expectedPayload });
    });
    it('should read from variant file', async () => {
      mezzo
        .route({
          id: routePathVariantId,
          path: routePathVariant,
          handler(req, res) {
            return mezzo.util.respondWithFile(this, req, res);
          },
        })
        .variant({
          id: variant1,
          handler(req, res) {
            return mezzo.util.respondWithFile(this, req, res);
          },
        });
      const res = await request.get(routePathVariant);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ variant: _default });

      await mezzo.setMockVariant({
        routeId: routePathVariantId,
        variantId: variant1,
      });

      const res2 = await request.get(routePathVariant);
      expect(res2.body).toEqual({ variant: variant1 });
    });
    it("handler's this and route are the same", async () => {
      let insideThis;
      const route = mezzo.route({
        id: routeId,
        path: routePath,
        handler(req, res) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          insideThis = this;
          res.sendStatus(200);
        },
      });
      await request.get(routePath);
      expect(route).toBe(insideThis);
    });
    it('should read file with dynamic path', async () => {
      mezzo
        .route({
          id: routePathDynamicId,
          path: routePathDynamic,
          handler(req, res) {
            return mezzo.util.respondWithFile(this, req, res);
          },
        })
        .variant({
          id: variant1,
          handler(req, res) {
            mezzo.util.respondWithFile(this, req, res);
          },
        });

      const res = await request.get('/part1/someDynamicPart2Path');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ variant: _default });
      await mezzo.setMockVariant({
        routeId: routePathDynamicId,
        variantId: variant1,
      });
      const res2 = await request.get('/part1/someDynamicPart2Path');
      expect(res2.body).toEqual({ variant: 'other' });
      const res3 = await request.get('/part1/someDynamicPart2PathAlt');
      expect(res3.body).toEqual({ variant: 'other' });
    });
    it('should support delay', async () => {
      // TODO: This test doesn't actually mock timers out so it's not perfect, it just confirms setTimeout was called accurate, could be improved
      const delay = 11;
      const spy = jest.spyOn(global, 'setTimeout');
      mezzo.route({
        id: routeId,
        path: routePath,
        async handler(req, res) {
          mezzo.util.respondWithFile(this, req, res, { delay });
        },
      });

      const res = await request.get(routePath);
      const timeoutArg = spy.mock.calls[0][1];
      expect(res.status).toBe(200);
      expect(timeoutArg).toBe(delay);
      spy.mockRestore();
    });
    it('should support no delay', async () => {
      // TODO: This test doesn't actually mock timers out so it's not perfect, it just confirms setTimeout was called accurate, could be improved
      const spy = jest.spyOn(global, 'setTimeout');
      mezzo.route({
        id: routeId,
        path: routePath,
        async handler(req, res) {
          mezzo.util.respondWithFile(this, req, res);
        },
      });

      const res = await request.get(routePath);
      expect(res.status).toBe(200);
      const timeoutArg = spy.mock.calls[0][1];
      expect(timeoutArg).toBe(0);
      spy.mockRestore();
    });
    it('should read session scoped variant from file', async () => {
      mezzo
        .route({
          id: routePathVariantId,
          path: routePathVariant,
          handler(req, res) {
            return mezzo.util.respondWithFile(this, req, res);
          },
        })
        .variant({
          id: variant1,
          handler(req, res) {
            return mezzo.util.respondWithFile(this, req, res);
          },
        });

      const res = await request.get(routePathVariant);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ variant: _default });

      await mezzo.setMockVariantForSession(sessionId, {
        [routePathVariantId]: variant1,
      });

      const res2 = await request
        .get(routePathVariant)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res2.body).toEqual({ variant: variant1 });
    });
    it('should read header scoped variant from file TODO', async () => {
      mezzo
        .route({
          id: routePathVariantId,
          path: routePathVariant,
          handler(req, res) {
            return mezzo.util.respondWithFile(this, req, res);
          },
        })
        .variant({
          id: variant1,
          handler(req, res) {
            return mezzo.util.respondWithFile(this, req, res);
          },
        });

      const res = await request.get(routePathVariant);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ variant: _default });

      const res2 = await request
        .get(routePathVariant)
        .set(X_REQUEST_VARIANT, variant1);
      expect(res2.body).toEqual({ variant: variant1 });
    });
  });
});
