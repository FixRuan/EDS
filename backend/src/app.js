import { fastify } from 'fastify'
import cors from '@fastify/cors';
import produtoRoutes from './routes/produtoRoutes.js';

const app = fastify();

app.register(cors, { origin: '*' });

app.register(produtoRoutes, { prefix: '/produtos' });

app.listen({port: process.env.PORT || 3000})
