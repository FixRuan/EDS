import {
  listarClientes,
  obterCliente,
  criarCliente,
  atualizarCliente,
  excluirCliente
} from '../controllers/clienteController.js';

export default async function clienteRoutes(fastify, opts) {
  fastify.get('/', listarClientes);
  fastify.get('/:id', obterCliente);
  fastify.post('/', criarCliente);
  fastify.put('/:id', atualizarCliente);
  fastify.delete('/:id', excluirCliente);
}
