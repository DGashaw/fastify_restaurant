import fastifyPlugin from 'fastify-plugin'

async function authPlugin(app, options){
    app.decorateRequest('isChef', function isChef(){
        return this.headers['api-key'] === options.accessToken;
    });

    app.decorate('authOnlyChef', async function(request, response){
        if(!request.isChef()){
            response.code(401);
            throw new Error('Invalid API Key');

        }
    });

    app.addHook('onRoute', function hook (routeOptions){
        if(routeOptions.config?.auth === true)
        {
            routeOptions.onRequest = [app.authOnlyChef].concat(routeOptions.onRequest || []);
        }
    })
}

export default fastifyPlugin(authPlugin);