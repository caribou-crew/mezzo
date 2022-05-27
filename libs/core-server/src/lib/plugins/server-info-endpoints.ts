import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import { Mezzo } from '../core';
import { version } from '../../../package.json';
import { GetInfoResponse } from '@caribou-crew/mezzo-interfaces';

export default () => (mezzo: Mezzo) => {
  const { app } = mezzo;
  /**
   * Returns list of which plugins are active along with server version #
   */
  app.get(`${MEZZO_API_PATH}/info`, (req, res) => {
    const response: GetInfoResponse = {
      appVersion: version,
      plugins: mezzo.pluginNames,
    };
    res.json(response);
  });

  return {
    name: 'server-info-plugins',
  };
};
