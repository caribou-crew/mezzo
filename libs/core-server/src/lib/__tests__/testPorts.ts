/**
 * There may be a better way to handle this, but this way each test that runs in parallel
 * can use a different port when spinning up a real mezzo server to avoid collision
 */
export const adminEndpointsPort = 3000;
export const adminEndpointsProfilesPort = 3010;
export const corePort = 3100;
export const redirectPort = 3200;
export const routeExpressPort = 3300;
export const fileIOPort = 3400;
export const routeStatePort = 3500;
export const recordingServerPort = 3600;
