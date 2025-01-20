import recipesPlugin from './routes/recipes.js';
import ordersPlugin from './routes/orders.js';
import authPlugin from './plugins/authPlugin.js';
import datasourcePlugin from './plugins/datasource.js';

const options = {
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
      removeAdditional: 'all'
    }
  }
};

async function appPlugin (app, options) {
  app.get('/', async function (request, response) {
    return { api: 'fastify-api', version: '1.0.0' };
  });

  app.register(authPlugin);
  app.register(recipesPlugin);
  app.register(ordersPlugin);
  app.register(datasourcePlugin);
}

export default appPlugin;
export { options as serverOptions };
