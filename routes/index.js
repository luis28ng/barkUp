import allRoutes from './routes.js'

const constructorMethod = (app) => {
  app.use('/', allRoutes);
  app.use('*', (req, res) => {
      return res.status(400).render('error', {
        Title: "Error",
        error: "Not found"});
    });

};
export default constructorMethod;