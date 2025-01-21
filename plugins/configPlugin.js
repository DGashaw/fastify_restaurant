import fastiyPlugin from 'fastify-plugin';
import fastifyEnv from '@fastify/env';

async function configPlugin(app, options){
    const enviromentalSchema = {
        type: 'object',
        required: ['API_KEY', 'DATABASE_URL'],
        properties: {
            NODE_ENV : {type: 'string', default: 'development'},
            PORT: {type: 'number', default: 3000},
            API_KEY: {type: 'string'},
            DATABASE_URL: {type: 'string'}
        }
    }

    app.register(fastifyEnv, {
        confKey: 'appConfig',
        schema: enviromentalSchema,
        data: options.applicationEnv
    })
}

export default fastiyPlugin(configPlugin);