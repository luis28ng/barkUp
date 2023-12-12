import allRoutes from './routes.js';
import reviewRoutes from './reviewRoutes.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
  app.use('/', allRoutes);
<<<<<<< HEAD
  app.use('/review', reviewRoutes)
  app.use('/public', staticDir('public'))
=======
>>>>>>> a7aa1597ecdd7ec791857201adeea56aa4e96332

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;