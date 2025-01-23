import fastify from 'fastify';
import appPlugin, { serverOptions } from './app.js';
import dotenv from 'dotenv';

dotenv.config(); //Used to read the enviromental variables
const app = fastify(serverOptions);

app.register(appPlugin, {
    applicationEnv: {
        API_KEY: process.env.API_KEY,
        DATABASE_URL: process.env.DATABASE_URL,
        ...process.env
    }
});

const port = process.env.port || 3000;
const hostname = process.env.hostname || '0.0.0.0';

await app.listen({ hostname, port });
