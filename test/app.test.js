import test from 'node:test';
import { deepStrictEqual, strictEqual, ok} from 'node:assert';
import buildApplication from './helper.js';

test('GET /', async function(t){
    const app = await buildApplication();
    t.after(async function(){
        await app.close();
    });

    const response = await app.inject({
        method: 'GET',
        url: '/'
    });

    strictEqual(response.statusCode, 200);
    deepStrictEqual(response.json(), {
        api: 'fastify-api',
        version: '1.0.0'
    })
});

test('Unauthorized users can not POST recipes', async function(t){
    const apiKey = 'test-suite-api-key';
    const app = await buildApplication({API_KEY: apiKey});

    t.after(async function(){
        await app.close();
    });

    const pizzaRecipe = {
        "name": 'pizza', "country": "ITA",  "description": "Delicious thin crusted pizza dough, tomato sauce, and any choice of toppings",
        "order": 2, "price": 16.99
    }
    const notAuthorizedResponse = await app.inject({
        method: 'POST',
        url: '/recipes',
        paylod: pizzaRecipe,
        headers: {
            'api-key': 'inavlid-key'
        }
    })

    strictEqual(notAuthorizedResponse.statusCode, 401);
});

test('Authorized users can POST recipes', async function(t){
    const apiKey = 'test-suite-api-key';
    const app = await buildApplication({API_KEY: apiKey});

    t.after(async function(){
        await app.close();
    });

    const pizzaRecipe = {
        "name": 'pizza', "country": "ITA",  "description": "Delicious thin crusted pizza dough, tomato sauce, and any choice of toppings",
        "order": 2, "price": 16.99
    }
    const authorizedResponse = await app.inject({
        method: 'POST',
        url: '/recipes',
        payload: pizzaRecipe,
        headers: {
            'content:type': 'application/json',
            'api-key': apiKey
        }
    })

    strictEqual(authorizedResponse.statusCode, 201);

    const recipeId = authorizedResponse.json().id;

    const menu = await app.inject({
        method: 'GET',
        url: '/menu'
    })

    strictEqual(menu.statusCode, 200);

    const recipes = menu.json();
    const recentAddedPizza = recipes.find(recipe => recipe.id === recipeId);

    ok(recentAddedPizza, 'The added pizza recipe is found on the menu');
});

