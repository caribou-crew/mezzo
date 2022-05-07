import * as bodyParser from 'body-parser';
import { Mezzo } from '../core';

export default () => (mezzo: Mezzo) => {
  mezzo.app.use(bodyParser.json({ limit: '5mb' }));
};
