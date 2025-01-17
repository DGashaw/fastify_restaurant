async function ordersPlugin(app, options){
    app.get('/orders', {
        handler: async function(request,response){
            request.log.info('GET request from /orders');
            throw new Error('GET request for /orders is not implemenetd');
        }
    });

    app.post('/orders', {
        handler: function(request, response,done){
            request.log.info('POST request from /orders');
            throw new Error('POST request for /orders is not implemented');

            done();
        }
    });

    app.delete('/orders/:id', {
        handler: async function(request, response){
            request.log.info('DELETE request from /orders/id');
            throw new Error('DELETE request for /orders/id is not implemented');
        }
    })
}

export default ordersPlugin;