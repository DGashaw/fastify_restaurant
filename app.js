import recipesPlugin from './routes/recipes.js';
import ordersPlugin from './routes/orders.js';

const options = {
  logger: true
};

async function appPlugin (app, options) {
  app.get('/', async function (request, response) {
    return { api: 'fastify-api', version: '1.0.0' };
  });

  app.register(recipesPlugin);
  app.register(ordersPlugin);
}

export default appPlugin;
export { options as serverOptions };
