import fastify from 'fastify';
import appPlugin, { serverOptions } from './app.js';

const app = fastify(serverOptions);

app.register(appPlugin, {
    applicationEnv: {
        API_KEY: 'fastify-rocks',
        DATABASE_URL: 'mongodb://localhost:27017/restaurant',
        ...process.env
    }
});

const port = process.env.port || 3000;
const hostname = process.env.hostname || '0.0.0.0';

await app.listen({ hostname, port });
