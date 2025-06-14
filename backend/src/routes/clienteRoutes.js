import {
  listarClientes,
  obterCliente,
  criarCliente,
  atualizarCliente,
  excluirCliente
} from '../controllers/clienteController.js';
import { autenticarJWT, apenasAdmin } from '../middlewares/auth.js';

export default async function clienteRoutes(fastify, opts) {
  fastify.addHook('onRequest', autenticarJWT);
  fastify.addHook('onRequest', apenasAdmin);

  fastify.get('/', listarClientes);
  fastify.get('/:id', obterCliente);
  fastify.post('/', criarCliente);
  fastify.put('/:id', atualizarCliente);
  fastify.delete('/:id', excluirCliente);
}
