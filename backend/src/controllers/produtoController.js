import * as produtoService from '../services/produtoService.js';

export async function listarProdutos(req, reply) {
  const produtos = await produtoService.getAllProdutos();
  reply.send(produtos);
}

export async function obterProduto(req, reply) {
  const { id } = req.params;
  const produto = await produtoService.getProdutoById(id);
  if (!produto) return reply.code(404).send({ message: 'Produto não encontrado' });
  reply.send(produto);
}

export async function criarProduto(req, reply) {
  const novo = await produtoService.createProduto(req.body);
  reply.code(201).send(novo);
}

export async function atualizarProduto(req, reply) {
  const { id } = req.params;
  const atualizado = await produtoService.updateProduto(id, req.body);
  reply.send(atualizado);
}

export async function atualizarEstoque(req, reply) {
  const { id } = req.params;
  const { quantidadeEstoque } = req.body;
  await produtoService.updateEstoque(id, quantidadeEstoque);
  reply.send({ message: 'Estoque atualizado', id, quantidadeEstoque });
}

export async function excluirProduto(req, reply) {
  const { id } = req.params;
  await produtoService.deleteProduto(id);
  reply.send({ message: 'Produto excluído' });
}
