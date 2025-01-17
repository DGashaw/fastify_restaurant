async function recipesPlugin(app, options){
    app.get('/recipes', {
        handler: menuHandler
    });

    app.get('/menu', {
        handler: menuHandler
    });

    app.post('/recipes', {
        config: {auth: true},
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

    throw new Error('GET request for /recipes and /menu are not implemented');
}

export default recipesPlugin;
