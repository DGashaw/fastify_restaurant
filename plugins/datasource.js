import fastifyMongo from 'fastify-mongodb'
import fastifyPlugin from 'fastify-plugin';

async function datasourcePlugin(app, options){
    //'mongodb+srv://fastify_restaurant:sVaCU2x7wvI8wcEr@restaurant.zrvda.mongodb.net/?retryWrites=true&w=majority&appName=restaurant'
    app.log.info('Establishing connection with mongoDB');
    app.register(fastifyMongo, {
        url: options.databaseUrl
    })

    app.decorate('source', {
        /**
         * @param {*} recipe is the recipe object that can be inserted
         * @returns the inserted recipe object id
         */
        async addRecipe(recipe){
            try{
                const { db } = app.mongo;
                const _id = new app.mongo.ObjectId();
                recipe._id = _id;
                recipe.id = _id.toString();

                const collection = db.collection('menu');
                const result = await 
                    collection.insertOne(recipe);
                return result.insertedId;
            }
            catch(error){
                throw new Error(`Error while adding a new recipe. Error: ${error.message}`);
            }
            
        },
        /**
         * 
         * @param {*} filter can have a value of an abject to get a single result as well as array of reults. If not specied, it returns all the recipes
         * @param {*} sort have a value of an object which specifies the oreder criteria,
         * @returns array of recipe objects
         */
        async readRecipes(filter, sort = {order: 1}){
            try{
                const { db } = app.mongo;
                const collection = db.collection('menu');
                const recipes = collection.find(filter, sort).toArray();
                return recipes;
            }
            catch(error){
                throw new Error(`Error while reading all recipes. Error: ${error.message}`);
            }
            
        },
        /**
         * 
         * @returns stream of recipes
         */
        async readRecipesStream(){
            try{
                const { db } = app.mongo;
                const collection = db.collection('menu');
                const result = collection.find({});

                return result.stream()
            }
            catch(error){
                throw new Error(`Error occured while streaming recipes. Error: ${error.message}`);
            }
            
        },

        async deleteRecipe(recipeId){
            
            try{
                const { db } = app.mongo;
                const collection = db.collection('menu');
                const result = collection.deleteOne({_id: new app.mongo.ObjectId(recipeId)});
                return result.deletedCount;

            }
            catch(error){
                throw new Error(`Error while deleting a recipe. Error: ${error.message}`);
            }
        },
        async addOrders(order){
            try{
                const _id = new app.mongo.ObjectId();
                const id = _id.toString();
                order._id = _id;
                order.id = id;
                const { db } = app.mongo;

                const collection = db.collection('order');
                const orderResult = await 
                    collection.insertOne(order);
                return orderResult.insertedId;
            }
            catch(error){
                throw new Error(`Unable to add order. Error: ${error.message}`);
            }
        },
        async readOrders(filter={}, sort = {createdAt: -1}){
            try{
                const { db } = app.mongo;
                const collection = db.collection('order');
                const orders = collection.aggregate([{$match: filter},{$sort: sort},
                ]).toArray();

                return orders;
            }
            catch(error){
                throw new Error(`Unable to read all orders. Error: ${error.message}`);
            }
        },
        async deleteOrders(orderId){
            try{
                const { db } = app.mongo;
                const collection = db.collection('order');

                const deleteCount = collection.deleteOne({_id: new app.mongo.ObjectId(orderId)});
                return deleteCount
            }
            catch(error){
                throw new Error(`Unable to delete the required oreder. Error: ${error.message}`)
            }
        },
        async updateOrderStatus(orderID){
            try{
                const { db } = app.mongo;
                const collection = db.collection('order');

                const updateResult = collection.updateOne({_id: new app.mongo.ObjectId(orderID)}, {$set: {status: 'pending'}});
                return updateResult;
            }
            catch(error){
                throw new Error(`Unable update the order status. Error: ${error.message}`);
            }
        }
    })
}

export default fastifyPlugin(datasourcePlugin);