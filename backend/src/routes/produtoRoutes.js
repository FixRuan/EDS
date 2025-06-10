import {
  listarProdutos,
  obterProduto,
  criarProduto,
  atualizarProduto,
  excluirProduto
} from '../controllers/produtoController.js';

export default async function produtoRoutes(fastify, opts) {
  fastify.get('/', listarProdutos);
  fastify.get('/:id', obterProduto);
  fastify.post('/', criarProduto);
  fastify.put('/:id', atualizarProduto);
  fastify.delete('/:id', excluirProduto);
}
