import * as SuperTestRequest from 'supertest';
import { fs, vol } from 'memfs';
import mezzo from '../core';
import * as path from 'path';
import { resourcesPath } from '../../utils/pathHelpers';
import { X_REQUEST_SESSION, X_REQUEST_VARIANT } from '../../utils/constants';

describe('route-file-io', () => {
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;
  beforeAll(() => {
    global.console = require('console'); // Don't stack trace out all console logs
  });

  let mockedDirectory;
  const routePath1 = '/respondWithFile';
  const routeId1 = `GET ${routePath1}`;

  const routePath2 = '/respondWithVariantReplyFromFile';
  const routeId2 = `GET ${routePath2}`;

  const routePath3Dynamic = '/part1/:part2';
  const routeId3Dynamic = `GET ${routePath3Dynamic}`;

  const routePath4Html = '/somePath/terms.html';
  const routeId4Html = `GET ${routePath4Html}`;

  const variant1 = 'variant1';
  const variant2 = 'v2';
  const _default = 'default';
  const sessionId = '123';
  const expectedPayload = 'Responding with file';

  const defaultHtml = `
        <html>
          <head><title>Terms agreement</title></head>
          <body>Hello world</body>
        </html>
  `;
  const variantHtml = `
        <html>
          <head><title>Terms agreement alternative</title></head>
          <body>Goodbye world</body>
        </html>
  `;
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
        './somePath/terms.html/GET/default.html': defaultHtml,
        './somePath/terms.html/GET/variant1.html': variantHtml,
      },
      mockedDirectory
    );
  });
  afterEach(async () => {
    await mezzo.stop();
    vol.reset();
  });
  describe('html', () => {
    it('should read from file', async () => {
      mezzo.route({
        id: routeId4Html,
        path: routePath4Html,
        callback: (req, res, route) => {
          return mezzo.util.respondWithFile(route, req, res);
        },
      });
      const res = await request.get(routePath4Html);
      expect(res.status).toBe(200);
      expect(res.text).toEqual(defaultHtml);
    });
    it('should read variant from file', async () => {
      mezzo
        .route({
          id: routeId4Html,
          path: routePath4Html,
          callback: (req, res, route) => {
            return mezzo.util.respondWithFile(route, req, res);
          },
        })
        .variant({
          id: variant1,
          callback: (req, res, route) => {
            return mezzo.util.respondWithFile(route, req, res);
          },
        });
      await mezzo.setMockVariant({ [routeId4Html]: variant1 });
      const res = await request.get(routePath4Html);
      expect(res.status).toBe(200);
      expect(res.text).toEqual(variantHtml);
    });
  });

  describe('collision of both json and html', () => {
    it('prefers json over html', async () => {
      vol.fromJSON(
        {
          './some.html/GET/default.html': 'hello world',
          './some.html/GET/default.json': '{"hello": "world"}',
        },
        mockedDirectory
      );
      mezzo.route({
        id: 'GET /some.html',
        path: '/some.html',
        callback: (req, res, route) => {
          return mezzo.util.respondWithFile(route, req, res);
        },
      });
      const res = await request.get('/some.html');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ hello: 'world' });
    });
  });

  describe('json', () => {
    it('should read from default file using backwards compatible handler', async () => {
      mezzo.route({
        id: routeId1,
        path: routePath1,
        handler(req, res) {
          return mezzo.util.respondWithFile(this, req, res);
        },
      });
      const res = await request.get(routePath1);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: expectedPayload });
    });
    it('cannot read file using handler with fat arrow function (likely unexpected behavior to users)', async () => {
      mezzo.route({
        id: routeId1,
        path: routePath1,
        handler: (req, res) => {
          // Based on how scoping of `this` works, if you put it inside a fat arrow function it'll break the reference of this
          return mezzo.util.respondWithFile(this, req, res);
        },
      });
      const res = await request.get(routePath1);
      expect(res.status).toBe(500);
    });
    it('should read from default file using explicit callback', async () => {
      mezzo.route({
        id: routeId1,
        path: routePath1,
        callback: (req, res, route) => {
          return mezzo.util.respondWithFile(route, req, res);
        },
      });
      const res = await request.get(routePath1);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: expectedPayload });
    });
    it('should read from variant file', async () => {
      mezzo
        .route({
          id: routeId2,
          path: routePath2,
          callback(req, res, route) {
            return mezzo.util.respondWithFile(route, req, res);
          },
        })
        .variant({
          id: variant1,
          callback(req, res, route) {
            return mezzo.util.respondWithFile(route, req, res);
          },
        });
      const res = await request.get(routePath2);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ variant: _default });

      await mezzo.setMockVariant({ [routeId2]: variant1 });

      const res2 = await request.get(routePath2);
      expect(res2.body).toEqual({ variant: variant1 });
    });
    it("handler's this and route are the same", async () => {
      let insideThis;
      const route = mezzo.route({
        id: routeId1,
        path: routePath1,
        handler(req, res) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          insideThis = this;
          res.sendStatus(200);
        },
      });
      await request.get(routePath1);
      expect(route).toBe(insideThis);
    });
    it('should read file with dynamic path', async () => {
      mezzo
        .route({
          id: routeId3Dynamic,
          path: routePath3Dynamic,
          callback(req, res, route) {
            return mezzo.util.respondWithFile(route, req, res);
          },
        })
        .variant({
          id: variant1,
          callback(req, res, route) {
            mezzo.util.respondWithFile(route, req, res);
          },
        });

      const res = await request.get('/part1/someDynamicPart2Path');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ variant: _default });
      await mezzo.setMockVariant({ [routeId3Dynamic]: variant1 });
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
        id: routeId1,
        path: routePath1,
        async callback(req, res, route) {
          mezzo.util.respondWithFile(route, req, res, { delay });
        },
      });

      const res = await request.get(routePath1);
      const timeoutArg = spy.mock.calls[0][1];
      expect(res.status).toBe(200);
      expect(timeoutArg).toBe(delay);
      spy.mockRestore();
    });
    it('should support no delay', async () => {
      // TODO: This test doesn't actually mock timers out so it's not perfect, it just confirms setTimeout was called accurate, could be improved
      const spy = jest.spyOn(global, 'setTimeout');
      mezzo.route({
        id: routeId1,
        path: routePath1,
        async callback(req, res, route) {
          mezzo.util.respondWithFile(route, req, res);
        },
      });

      const res = await request.get(routePath1);
      expect(res.status).toBe(200);
      const timeoutArg = spy.mock.calls[0][1];
      expect(timeoutArg).toBe(0);
      spy.mockRestore();
    });
    it('should read session scoped variant from file', async () => {
      mezzo
        .route({
          id: routeId2,
          path: routePath2,
          callback(req, res, route) {
            return mezzo.util.respondWithFile(route, req, res);
          },
        })
        .variant({
          id: variant1,
          callback(req, res, route) {
            return mezzo.util.respondWithFile(route, req, res);
          },
        });

      const res = await request.get(routePath2);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ variant: _default });

      await mezzo.setMockVariantForSession(sessionId, {
        [routeId2]: variant1,
      });

      const res2 = await request
        .get(routePath2)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res2.body).toEqual({ variant: variant1 });
    });
    it('should read header scoped variant from file', async () => {
      mezzo
        .route({
          id: routeId2,
          path: routePath2,
          callback(req, res, route) {
            return mezzo.util.respondWithFile(route, req, res);
          },
        })
        .variant({
          id: variant1,
          callback(req, res, route) {
            return mezzo.util.respondWithFile(route, req, res);
          },
        });

      const res = await request.get(routePath2);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ variant: _default });

      const res2 = await request
        .get(routePath2)
        .set(X_REQUEST_VARIANT, variant1);
      expect(res2.body).toEqual({ variant: variant1 });
    });
  });
});
