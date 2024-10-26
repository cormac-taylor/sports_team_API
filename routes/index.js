/*
 * Cormac Taylor
 * I pledge my honor that I have abided by the Stevens Honor System.
 */

import teamRoutes from './teams.js';
import gameRoutes from './games.js';

const constructorMethod = (app) => {
  app.use('/teams', teamRoutes);
  app.use('/games', gameRoutes);

  app.use('*', (_, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;