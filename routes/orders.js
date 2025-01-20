async function ordersPlugin(app, options){
    const orderBody = {
        type: 'object',
        required: ['table', 'dishes'],
        properties: {
            table: {type: 'number', minimum: 1},
            dishes: {
                type: 'array', 
                minItems: 1,
                items: {
                    type: 'object',
                    required: ['id', 'quantity'],
                    properties: {
                        id: {type: 'string', minLength: 24, maxLength:24},
                        quantity: {type: 'number', minimum: 1}
                    }
                }
        }
        }
    };

    const orderSchemaList = {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: {type: 'string'},
                createdAt: {type: 'string', format: 'date-time'},
                status: {type: 'string'},
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {type: 'string'},
                            order: {type: 'number'},
                            quantity: {type: 'number'}
                        }
                    }
                }
            }
        }
    }

    app.get('/orders', {
        schema: {
            response: {
                200: orderSchemaList
            }
        },
        handler: async function(request,response){
            request.log.info('GET request from /orders');
            try{
                const pendingOrders = await app.source.readOrders({status: 'pending'});
                const recipes = await app.source.readRecipes();
                
                const updatingPendingOrders = pendingOrders
                            .map(order =>{
                                order.items = order.items
                                    .map(item => {
                                        const recipe = recipes.find(recipe => recipe.id === item.id);
                                        return recipe ? {...recipe, quantity: item.quantity} : undefined;
                                    })
                                    .filter(recipe => recipe !== undefined)
                                    return order;
                            })
                return updatingPendingOrders;
                            
            }
            catch(error){
                app.log.error(error.message);
                response.code(500).send(error.message);
            }
        }
    });

    app.post('/orders', {
        config: {auth: true},
        schema: {body: orderBody},
        handler: async function(request, response){
            request.log.info('POST request from /orders');
            try{
                const order = {
                    status: 'pending',
                    orderAt: new Date(),
                    items: request.body.dishes
                }
                const orderId = await app.source.addOrders(order);
                response.code(201);
                return {message: 'order successfully submitted', orderId};
            }
            catch(error){
                app.log.error(error.message);
                response.code(500).send({error: error.message});
            }

        }
    });

    app.delete('/orders/:id', {
        config: {auth: true},
        schema: {
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: {type: 'string', minLength: 24, maxLength: 24}
                }
            }
        },
        handler: async function(request, response){
            request.log.info('DELETE request from /orders/id');
            try{
                const id = request.params.id;
                const searchOrder = await app.source.readOrders({id});

                if(searchOrder){
                    try{
                        const deleteResponse = await app.source.deleteOrders(id)
                        response.code(201);
                        return deleteResponse;
                    }
                    catch(error){
                        app.log.error(error.message);
                        response.code(500).send({error: error.message});
                    }
                    
                }
                else{
                    response.code(404).send({error: `An order with id = ${id} can not be found`});
                }
            }
            catch(error){
                app.log.error(error.message);
                response.code(500).send({error: error.message});
            }
            
        }
    });

    app.patch('/orders/:id', {
        config: {auth: true},
        schema: {
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: {type: 'string', minLength: 24, maxLength: 24}
                }
            }
        },
        handler: async function(request, response){
            try{
                const id = request.params.id;
                const searchOrder = await app.source.readOrders({id});

                if(searchOrder){
                    try{
                        const updateResponse = await app.source.updateOrderStatus(id)
                        response.code(201);
                        return updateResponse;
                    }
                    catch(error){
                        app.log.error(error.message);
                        response.code(500).send({error: error.message});
                    }
                    
                }
                else{
                    response.code(404).send({error: `An order with id = ${id} can not be found`});
                }
            }
            catch(error){
                app.log.error(error.message);
                response.code(500).send({error: error.message});
            }
        }
    })
}

export default ordersPlugin;