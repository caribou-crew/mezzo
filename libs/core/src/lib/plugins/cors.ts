import * as cors from 'cors';
import { Mezzo } from '../core';

export default () => (mezzo: Mezzo) => {
  mezzo.app.use(cors({ origin: '*' }));
};
