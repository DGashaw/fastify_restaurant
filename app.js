const options = {
  logger: true
};

async function appPlugin (app, options) {
  app.get('/', async function (request, response) {
    return { api: 'fastify-api', version: '1.0.0' };
  });
}

export default appPlugin;
export { options as serverOptions };
