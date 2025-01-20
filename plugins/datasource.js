import fastifyMongo from 'fastify-mongodb'
import fastifyPlugin from 'fastify-plugin';

async function datasourcePlugin(app, options){
    //'mongodb+srv://fastify_restaurant:sVaCU2x7wvI8wcEr@restaurant.zrvda.mongodb.net/?retryWrites=true&w=majority&appName=restaurant'
    app.log.info('Establishing connection with mongoDB');
    app.register(fastifyMongo, {
        url: 'mongodb://localhost:27017/restaurant'
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
                app.log.error(`Error while adding a new recipe. Error: ${error.message}`);
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
                const result = collection.find(filter, sort).toArray();
                return result;
            }
            catch(error){
                app.log.error(`Error while reading all recipes. Error: ${error.message}`);
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
                app.log.error(`Error occured while streaming recipes. Error: ${error.message}`);
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
                app.log.error('Error while deleting a recipe');
                throw new Error(`Error while deleting a recipe. Error: ${error.message}`);
            }
        },
        async insertOrder(order){
            /** Not Implemented */
        },
        async readOrders(filter, sort){
            /** Not Implemented */
        },
        async deleteOrder(orderId){
            /** Not Implemented */
        },
        async updateOrderStatus(orderID){
            /** Not Implemented */
        }
    })
}

export default fastifyPlugin(datasourcePlugin);