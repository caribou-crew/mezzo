import mezzo from '../index';
import { Server } from 'http';
import * as SuperTestRequest from 'supertest';
import * as path from 'path';
import { resourcesPath } from '../lib/utils/pathHelpers';

export const getHTTPPort = () => 3000;

export const getTestServer = async (): Promise<any> => {
  const mockedDirectory = path.join(resourcesPath, 'mocked-data');
  // require('../resources/endpoints');
  return await mezzo.start({
    port: getHTTPPort(),
    mockedDirectory,
  });
};

export const getMezzo = (): typeof mezzo => {
  return mezzo;
};

export const stopTestServer = async (server?: Server) => {
  await mezzo.stop(server);
};

export const getSuperTest = () => {
  return SuperTestRequest(`http://localhost:${getHTTPPort()}`);
};
