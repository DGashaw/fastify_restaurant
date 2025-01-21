import recipesPlugin from './routes/recipes.js';
import ordersPlugin from './routes/orders.js';
import authPlugin from './plugins/authPlugin.js';
import datasourcePlugin from './plugins/datasource.js';
import configPlugin from './plugins/configPlugin.js';

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

  await app.register(configPlugin, options);
  app.register(authPlugin, 
    {accessToken: app.appConfig.API_KEY
    });
  app.register(recipesPlugin);
  app.register(ordersPlugin);
  app.register(datasourcePlugin, {
    databaseUrl: app.appConfig.DATABASE_URL
  });
}

export default appPlugin;
export { options as serverOptions };
