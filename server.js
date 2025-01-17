import fastify from 'fastify';
import appPlugin, { serverOptions } from './app.js';

const app = new fastify(serverOptions);

app.register(appPlugin);

const port = process.env.port || 3000;
const hostname = process.env.hostname || '0.0.0.0';

await app.listen({ hostname, port });
