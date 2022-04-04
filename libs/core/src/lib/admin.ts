import * as express from 'express';
import { ServerOptions } from '../types';

export const addAdminEndpoints = (app: express.Express) => {
  app.get(`/api`, (req, res) => {
    res.status(200).json({ message: 'Hello world from api' });
  });
};
export const addAdminStaticSite = (
  app: express.Express,
  options?: ServerOptions
) => {
  app.get(`/${options?.adminEndpoint ?? 'mezzo'}`, (req, res) => {
    res.status(200).send('TODO HTML Site');
  });
  // app.use(
  //   `/${options?.adminEndpoint ?? 'mezzo'}`,
  //   express.static(path.join(__dirname, 'web'))
  // );
  // app.use(express.static(path.join(__dirname, 'web')));
};
