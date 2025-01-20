import JSONStream from 'JSONStream';

async function recipesPlugin(app, options){

    const bodySchema = {
        type: 'object',
            required: ['name', 'country', 'order', 'price'],
            properties: {
                name: {type: 'string', minLength: 3, maxLength: 50},
                country: {type: 'string', enum: ['ITA', 'ENG', 'ETH']},
                description: {type: 'string'},
                order: {type: 'number', minimum: 0, maximum: 100},
                price: {type: 'number', minimum: 0, maximum: 50}
            }
    };
    app.get('/recipes', {
        handler: menuHandler
    });

    app.get('/menu', {
        handler: menuHandler
    });

    app.get('/recipes/stream', {
        handler: async function batchMenuHandler(request, response){
            try{
                const readableStream = await app.source.readRecipesStream();
                response.raw.writeHead(200, {'Content-Type':'application/json'});

           
                readableStream
                    .pipe(JSONStream.stringify('[',',',']'))
                    .pipe(response.raw)
                    .on('end' , () => {
                        app.log.info('All recipe data has been sent');
                    })
                    .on('error', (error) => {
                        app.log.error(`Error occured while reading the recipe data. Error: ${error.message}`);
                        response.raw.destroy(error);
                    });
        }
            catch(error){
                app.log.error(`Error: failed to stream recipes. Error: ${error.message}`)
                response.code(500).send({error: 'failed to stream recipes'})
            }
        }
    });

    app.post('/recipes', {
        config: {auth: true},
        schema: {
            body: bodySchema
        },
        handler: async function addRecipeToMenu(request, response){
            app.log.info('POST reuest from /recipes')
            try{
                const { name, country, description, order, price } = request.body;
                const insertedRecipeId = await app.source.addRecipe({
                        name,
                        country,
                        description,
                        order,
                        price,
                        createdAt: new Date()
                    }
                );

                response.code(201);
                return {message: 'recipe added successfully', id: insertedRecipeId};
            }
            catch(error){
                app.log.error(error.message);
                response.code(500).send({error: error.message});
            }
        }
    })

    app.delete('/recipes/:id', {
        config: {auth: true},
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {type: 'string', minLength: 24, maxLength: 24}
            }
        }},
        handler: async function removeRecipe(request, response){
            app.log.info('DELETE request from /recipes/:id');
            const id = request.params.id;
            
            try{
                const [getRecipe] = await app.source.readRecipes({id})

                if(!getRecipe){
                    app.log.error(`A recipe with id = ${id} can't be found. Delete operation failed`);
                    response.code(404).send({error: `Recipe with id = ${id} can not be found.`});
                }
    
                else{
                    try{
                        const result = await app.source.deleteRecipe(id);
                        response.code(201);
                    }
                    catch(error){
                        response.code(500).send({error: error.message});
                    }
                }
            }
            catch(error){
                app.log.error(error.message);
                response.code(500).send({error: error.message});
            }
            
            
            
        }
    })
}

async function menuHandler(request, response){
    try
    {
        const allRecipes = await this.source.readRecipes();
        return allRecipes;
    }
    catch(error){
        app.log(error.message);
        response.code(500).send({error: `${error.message}`});
    }
   
}

export default recipesPlugin;
