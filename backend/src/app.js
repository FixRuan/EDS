import { fastify } from 'fastify'
import cors from '@fastify/cors';
import produtoRoutes from './routes/produtoRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import pedidoProdutoRoutes from './routes/pedidoProdutoRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = fastify();

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(loginRoutes);
app.register(funcionarioRoutes, { prefix: '/funcionarios' });
app.register(clienteRoutes, { prefix: '/clientes' });
app.register(produtoRoutes, { prefix: '/produtos' });
app.register(pedidoRoutes, { prefix: '/pedidos' });

app.register(pedidoProdutoRoutes, { prefix: '/pedido-produto' });
app.register(adminRoutes, { prefix: '/admin' });

app.listen({port: process.env.PORT || 3000})
