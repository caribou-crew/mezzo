import mezzoClient from '../../core-client';

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
      hostname: 'example.com',
      port: null,
    });
    const url = client.getConnectionFromOptions();
    expect(url).toBe('http://example.com/_admin/api');
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
