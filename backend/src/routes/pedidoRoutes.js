import {
  listarPedidos,
  obterPedido,
  criarPedido,
  atualizarPedido,
  excluirPedido
} from '../controllers/pedidoController.js';

export default async function pedidoRoutes(fastify, opts) {
  fastify.get('/', listarPedidos);
  fastify.get('/:id', obterPedido);
  fastify.post('/', criarPedido);
  fastify.put('/:id', atualizarPedido);
  fastify.delete('/:id', excluirPedido);
}
