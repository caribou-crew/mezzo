import { clientServerIntegrationTests } from '@mezzo/core-client-server-tests';

/**
 * We put these integration tests between client & server in a shared lib and then call from client & server unit tests.
 * This does mean tests are ran 2x but they're written only 1x.  It's required so that coverage is accurately reflected, as
 * tests in core-server don't impact core-client coverage and vice versa
 */
clientServerIntegrationTests();
