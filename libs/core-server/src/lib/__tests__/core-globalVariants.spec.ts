import mezzo from '../core';
import { globalVariantPort } from './testPorts';
import mezzoClient from '@caribou-crew/mezzo-core-client';

/**
 * Tests global variants
 */
describe('core.addGlobalVariant', () => {
  beforeAll(() => {
    // global.console = require('console'); // Don't stack trace out all console logs
  });

  const variant2 = 'v2';
  const port = globalVariantPort + Number(process.env.JEST_WORKER_ID);
  beforeEach(async () => {
    process.env.LOG_LEVEL = 'warn';
    await mezzo.start({
      port,
    });

    mezzo.route({
      id: 'GET /something',
      path: 'something',
    });

    mezzo.addGlobalVariant({
      id: variant2,
    });
  });
  afterEach(async () => {
    await mezzo.stop();
  });

  it('should add to existing routes', async () => {
    const client = mezzoClient({ port });
    const routes = await client.getRoutes();
    const globalVariant = routes.data.routes[0].variants[1];

    expect(globalVariant.id).toBe(variant2);
    expect(globalVariant.category).toBe('Global Variants');
  });
});
