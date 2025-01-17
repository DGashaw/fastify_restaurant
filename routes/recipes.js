async function recipesPlugin(app, options){
    app.get('/recipes', {
        handler: menuHandler
    });

    app.post('/recipes', {
        handler: async function(request, response){
            app.log.info('POST reuest from /recipes')
            throw new Error('POST request for /recipes is not implemented');
        }
    })

    app.delete('/recipes/:id', {
        handler: async function(request, response){
            app.log.info('DELETE request from /recipes/:id');
            throw new Error('DELETE request for /recipes/:id is not implemented');
        }
    })
}

async function menuHandler(request, response){
    this.log.info('GET request from /recipes based on this');
    request.log.info('GET request from /recipes based on request object');

    throw new Error('Founctionalities for menu/recipes are not implemented');
}

export default recipesPlugin;
