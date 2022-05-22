import { MEZZO_API_PATH } from '@caribou-crew/mezzo-constants';
import { Mezzo } from '../core';

export default () => (mezzo: Mezzo) => {
  const { app } = mezzo;
  /**
   * Returns data set in call to mezzo.profile
   */
  app.get(`${MEZZO_API_PATH}/profiles`, (req, res) => {
    res.json({ profiles: mezzo.userProfiles });
  });

  return {
    name: 'profiles-plugins',
  };
};
