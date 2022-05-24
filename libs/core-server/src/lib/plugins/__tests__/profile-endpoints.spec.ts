import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import SuperTestRequest from 'supertest';
import mezzo from '../../core';
import MezzoClient from '@caribou-crew/mezzo-core-client';
import { adminEndpointsProfilesPort } from '@mezzo/core-client-server-tests';

describe('profile-endpoints', () => {
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;
  const port = adminEndpointsProfilesPort;
  let client;
  beforeAll(() => {
    client = MezzoClient({ port });
    // global.console = require('console'); // Don't stack trace out all console logs
    process.env.LOG_LEVEL = 'warn';
  });

  beforeEach(async () => {
    process.env.LOG_LEVEL = 'warn';
    request = SuperTestRequest(`http://localhost:${port}`);
    await mezzo.start({
      port,
    });

    const testRoutes = ['route1', 'route2', 'route3'];
    testRoutes.forEach((id) => {
      mezzo
        .route({
          id,
          path: `/${id}`,
          callback: (req, res) => {
            res.json({});
          },
        })
        .variant({
          id: `${id}-variant`,
          callback: (req, res) => {
            res.json();
          },
        });
    });
  });
  afterEach(async () => {
    await mezzo.stop();
  });
  describe('get current variants as profile', () => {
    it('should return non results if all routes are in default state', async () => {
      const res = await request.get(`${MEZZO_API_PATH}/activeVariants`);
      expect(res.status).toBe(200);
      expect(res.body.variants).toHaveLength(0);
    });
    it('should return variants when set', async () => {
      const payload = [{ routeID: 'route2', variantID: 'route2-variant' }];
      await client.setMockVariant(payload);

      const res = await request.get(`${MEZZO_API_PATH}/activeVariants`);
      expect(res.status).toBe(200);
      expect(res.body.variants).toHaveLength(1);
      expect(res.body.variants).toEqual(payload);
    });
  });
  describe('start server with global profile', () => {
    it('client should be able to fetch all remote profiles', async () => {
      const payload = [{ routeID: 'route2', variantID: 'route2-variant' }];
      mezzo.profile('Some profile name', payload);

      const res = await request.get(`${MEZZO_API_PATH}/profiles`);
      expect(res.status).toBe(200);
      expect(res.body.profiles).toHaveLength(1);
      expect(res.body.profiles[0]).toEqual({
        name: 'Some profile name',
        variants: payload,
      });
    });
  });
});
