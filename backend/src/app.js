import { fastify } from 'fastify'
import cors from '@fastify/cors';
import produtoRoutes from './routes/produtoRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';

const app = fastify();

app.register(cors, { origin: '*' });

app.register(produtoRoutes, { prefix: '/produtos' });
app.register(funcionarioRoutes, { prefix: '/funcionarios' });
app.register(clienteRoutes, { prefix: '/clientes' });

app.listen({port: process.env.PORT || 3000})
