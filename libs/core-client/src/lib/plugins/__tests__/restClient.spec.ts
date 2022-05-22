import SuperTestRequest from 'supertest';
import mezzo from '@caribou-crew/mezzo-core-server';
import mezzoClient from '../../core-client';
import { X_REQUEST_SESSION } from '@caribou-crew/mezzo-constants';
// import { corePort } from './testPorts';

/**
 * core-server is backend express business logic
 * core-client's restClient is simply an abstractions over axios to faciliate making the API calls
 *
 * This unit test is more of an integration asserting the client call performs the expected behavior, which requires the core-server running
 * Ideally at this integration level the test is written (& ran) once, but coverage can apply to both core-client and core-server modules.
 *
 * Worse case is writing this test by hand in both modules.
 */
describe('restClient connection options', () => {
  let client: ReturnType<typeof mezzoClient>;

  beforeAll(() => {
    global.console = require('console'); // Don't stack trace out all console logs
    process.env.LOG_LEVEL = 'warn';
  });

  beforeEach(() => {
    client = mezzoClient();
  });

  it('should allow relative URLs', () => {
    client = mezzoClient({
      useRelativeUrl: true,
    });
    const url = client.getConnectionFromOptions();
    expect(url).toBe('/_admin/api');
  });
  it('should construct the URL accurately', () => {
    client = mezzoClient();
    const url = client.getConnectionFromOptions();
    expect(url).toBe('http://localhost:8000/_admin/api');
  });
  it('should allow for no port', () => {
    client = mezzoClient({
      port: null,
    });
    const url = client.getConnectionFromOptions();
    expect(url).toBe('http://localhost/_admin/api');
  });
  it('secure domain with no port', () => {
    client = mezzoClient({
      port: null,
      hostname: 'www.example.com',
      secure: true,
    });
    const url = client.getConnectionFromOptions();
    expect(url).toBe('https://www.example.com/_admin/api');
  });
  it('should allow overwiting clinet options at the function level', () => {
    client = mezzoClient({
      port: 8080,
      hostname: 'localhost',
      secure: true,
    });
    const url = client.getConnectionFromOptions({
      port: 8081,
      hostname: '127.0.0.1',
      secure: false,
    });
    expect(url).toBe('http://127.0.0.1:8081/_admin/api');
  });
  it('should use defaults with null options at client level', () => {
    client = mezzoClient(null);
    const url = client.getConnectionFromOptions();
    expect(url).toBe('http://localhost:8000/_admin/api');
  });
  it('should use defaults with null options at function level and null options at client level', () => {
    client = mezzoClient(null);
    const url = client.getConnectionFromOptions(null);
    expect(url).toBe('http://localhost:8000/_admin/api');
  });
});

describe('restClient', () => {
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;
  beforeAll(() => {
    // global.console = require('console'); // Don't stack trace out all console logs
  });

  const route1 = 'someId';
  const route1Path = '/somePath';
  const variant1 = 'A2';
  const a1Default = 'A1-default';
  const b1Default = 'B1-default';

  const route2 = 'someOtherId';
  const route2Path = '/someOtherPath';
  const variant2 = 'B2';
  const sessionId = '123';
  let client: ReturnType<typeof mezzoClient>;

  beforeEach(async () => {
    process.env.LOG_LEVEL = 'warn';
    const port = 3020;
    client = mezzoClient({ port });
    request = SuperTestRequest(`http://localhost:${port}`);
    await mezzo.start({
      port,
    });

    mezzo
      .route({
        id: route1,
        path: route1Path,
        handler: function (req, res) {
          res.json({ someKey: a1Default });
        },
      })
      .variant({
        id: variant1,
        handler: function (req, res) {
          res.json({ someKey: variant1 });
        },
      });

    mezzo
      .route({
        id: route2,
        path: route2Path,
        handler: function (req, res) {
          res.json({ someKey: b1Default });
        },
      })
      .variant({
        id: variant2,
        handler: function (req, res) {
          res.json({ someKey: variant2 });
        },
      });
  });
  afterEach(async () => {
    await mezzo.stop();
  });

  describe('.setMockVariantForSession', () => {
    it('should reset all variants for session when setting new values', async () => {
      await client.setMockVariantForSession(sessionId, [
        { routeID: route1, variantID: variant1 },
        { routeID: route2, variantID: variant2 },
      ]);

      const res1 = await request
        .get(route1Path)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res1.body.someKey).toBe(variant1);

      await client.setMockVariantForSession(sessionId, [
        { routeID: route2, variantID: variant2 },
      ]);

      const res2 = await request
        .get(route1Path)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res2.body.someKey).toBe(a1Default);
    });
  });

  describe('.updateMockVariantForSession', () => {
    it('should preserve prior variants without collision for session when setting new values', async () => {
      await client.setMockVariantForSession(sessionId, [
        { routeID: route1, variantID: variant1 },
        { routeID: route2, variantID: variant2 },
      ]);

      const res1 = await request
        .get(route1Path)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res1.body.someKey).toBe(variant1);

      await client.updateMockVariantForSession(sessionId, [
        { routeID: route2, variantID: variant2 },
      ]);

      const res2 = await request
        .get(route1Path)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res2.body.someKey).toBe(variant1);
    });
  });

  describe('.setMockVariant', () => {
    it('should change the active variant of route', async () => {
      const res = await request.get(route1Path);
      expect(res.body).toEqual({ someKey: a1Default });

      await client.setMockVariant([{ routeID: route1, variantID: variant1 }]);
      const res2 = await request.get(route1Path);
      expect(res2.body).toEqual({ someKey: variant1 });
    });
  });

  describe('.resetMockVariantForSession', () => {
    it('should reset all variants for session', async () => {
      await client.setMockVariantForSession(sessionId, [
        { routeID: route1, variantID: variant1 },
        { routeID: route2, variantID: variant2 },
      ]);

      const res1 = await request
        .get(route1Path)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res1.body.someKey).toBe(variant1);

      await client.resetMockVariantForSession(sessionId);

      const res2 = await request
        .get(route1Path)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res2.body.someKey).toBe(a1Default);
    });
  });
  describe('.resetMockVariantForAllSessions', () => {
    it('should reset all variants for session', async () => {
      await client.setMockVariantForSession(sessionId, [
        { routeID: route1, variantID: variant1 },
        { routeID: route2, variantID: variant2 },
      ]);

      const res1 = await request
        .get(route1Path)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res1.body.someKey).toBe(variant1);

      await client.resetMockVariantForAllSessions();

      const res2 = await request
        .get(route1Path)
        .set(X_REQUEST_SESSION, sessionId);
      expect(res2.body.someKey).toBe(a1Default);
    });
  });
  describe('.resetMockVariant', () => {
    it('should reset all variants', async () => {
      await client.setMockVariant([{ routeID: route1, variantID: variant1 }]);
      const res1 = await request.get(route1Path);
      expect(res1.body).toEqual({ someKey: variant1 });

      await client.resetMockVariant();
      const res2 = await request.get(route1Path);
      expect(res2.body).toEqual({ someKey: a1Default });
    });
  });
  describe('.getRoutes', () => {
    it('should fetch existing routes', async () => {
      const response = await client.getRoutes();
      const { routes } = response.data;

      expect(response.status).toBe(200);
      expect(routes).toHaveLength(2);
      expect(routes[0]).toEqual({
        id: 'someId',
        method: 'GET',
        path: '/somePath',
        activeVariant: 'default',
        variants: [
          {
            category: 'Variants',
            id: 'default',
          },
          {
            category: 'Variants',
            id: 'A2',
          },
        ],
      });
    });
  });

  describe('.getActiveVariants', () => {
    it('should get no active variants when all routes are default', async () => {
      const response = await client.getActiveVariants();
      const { variants } = response.data;

      console.log(variants);
      expect(variants).toHaveLength(0);
    });
    it('should get once active variants when only one route is not default', async () => {
      await client.setMockVariant([{ routeID: route1, variantID: variant1 }]);
      const response = await client.getActiveVariants();
      const { variants } = response.data;

      console.log(variants);
      expect(variants).toHaveLength(1);
    });
  });

  describe('.updateMockVariant', () => {
    it('should preserve prior variants without collision for session when setting new values', async () => {
      await client.setMockVariant([
        { routeID: route1, variantID: variant1 },
        { routeID: route2, variantID: variant2 },
      ]);

      const res1 = await request.get(route1Path);
      expect(res1.body.someKey).toBe(variant1);

      await client.updateMockVariant([
        { routeID: route2, variantID: variant2 },
      ]);

      const res2 = await request.get(route1Path);
      expect(res2.body.someKey).toBe(variant1);

      const res3 = await request.get(route2Path);
      expect(res3.body.someKey).toBe(variant2);
    });
  });
  describe('.getRemoteProfiles', () => {
    it('should fetch profiles defined on the server', async () => {
      mezzo.profile('Some Profile Name', [
        { routeID: route1, variantID: variant1 },
      ]);
      const response = await client.getRemoteProfiles();
      expect(response.data.profiles).toHaveLength(1);
      expect(response.data.profiles[0].name).toBe('Some Profile Name');
      expect(response.data.profiles[0].variants).toEqual([
        { routeID: route1, variantID: variant1 },
      ]);
    });
  });
  describe('.getLocalProfiles', () => {
    it.skip('should work', async () => {
      // TODO this requires testing localStorage
      // const data = client.getLocalProfiles();
    });
  });
  describe('.getRecordings', () => {
    it('should work', async () => {
      const response = await client.getRecordings();
      expect(response.status).toBe(200);
      expect(response.data.items).toHaveLength(0);
      // TODO assert behavior on server
    });
  });
  describe('.deleteRecordings', () => {
    it('should work', async () => {
      const response = await client.deleteRecordings();
      expect(response.status).toBe(204);
      expect(response.data).toBe('');
      // TODO assert behavior on server
    });
  });
});
