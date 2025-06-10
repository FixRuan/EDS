import { fastify } from 'fastify'
import cors from '@fastify/cors';
import produtoRoutes from './routes/produtoRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';

const app = fastify();

app.register(cors, { origin: '*' });

app.register(produtoRoutes, { prefix: '/produtos' });
app.register(funcionarioRoutes, { prefix: '/funcionarios' });

app.listen({port: process.env.PORT || 3000})
