import {
  associarProdutoAPedido,
  desassociarProdutoDoPedido,
  obterProdutosDoPedido,
  obterPedidosDoProduto,
  atualizarQuantidadeProdutoDoPedido
} from '../controllers/pedidoProdutoController.js';

export default async function pedidoProdutoRoutes(fastify, opts) {
  fastify.post('/', associarProdutoAPedido);
  fastify.delete('/:idPedido/:idProduto', desassociarProdutoDoPedido);
  fastify.get('/pedidos/:idPedido/produtos', obterProdutosDoPedido);
  fastify.get('/produtos/:idProduto/pedidos', obterPedidosDoProduto);
  fastify.put('/:idPedido/:idProduto', atualizarQuantidadeProdutoDoPedido);
}
