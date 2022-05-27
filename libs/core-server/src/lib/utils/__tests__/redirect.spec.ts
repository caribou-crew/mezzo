import SuperTestRequest from 'supertest';
import mezzo from '../../core';
import { redirectPort } from '@mezzo/core-client-server-tests';

/**
 * Tests support for mezzo.redirect
 */
describe('redirects', () => {
  let request: SuperTestRequest.SuperTest<SuperTestRequest.Test>;

  beforeEach(async () => {
    const port = redirectPort + Number(process.env.JEST_WORKER_ID);
    request = SuperTestRequest(`http://localhost:${port}`);
    await mezzo.start({
      port,
    });
    mezzo.redirect('/someInPath', '/someOutPath');
  });
  afterEach(async () => {
    await mezzo.stop();
  });

  it('should redirect the in path to the out path', async () => {
    const res1 = await request.get('/someInPath');
    expect(res1.redirect).toBe(true);
    expect(res1.get('location')).toBe('/someOutPath');
  });
});
