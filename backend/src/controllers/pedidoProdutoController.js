import * as pedidoProdutoService from '../services/pedidoProdutoService.js';

import * as pedidoService from '../services/pedidoService.js';
import * as produtoService from '../services/produtoService.js';

export async function associarProdutoAPedido(req, reply) {
  try {
    const { idPedido, idProduto } = req.body;

    if (!idPedido || !idProduto) {
      return reply.code(400).send({ message: 'IDs de Pedido e Produto são obrigatórios.' });
    }

    const pedidoExiste = await pedidoService.getPedidoById(idPedido);
    if (!pedidoExiste) {
      return reply.code(404).send({ message: `Pedido com ID ${idPedido} não encontrado.` });
    }

    const produtoExiste = await produtoService.getProdutoById(idProduto);
    if (!produtoExiste) {
      return reply.code(404).send({ message: `Produto com ID ${idProduto} não encontrado.` });
    }

    const novaAssociacao = await pedidoProdutoService.associateProdutoToPedido(idPedido, idProduto);
    reply.code(201).send(novaAssociacao);
  } catch (error) {
    console.error('Erro ao associar produto ao pedido:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return reply.code(409).send({ message: 'Este produto já está associado a este pedido.' });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return reply.code(400).send({ message: 'ID de Pedido ou Produto inválido (não existe nas tabelas principais).' });
    }
    reply.code(500).send({ message: 'Erro interno do servidor ao associar produto ao pedido.' });
  }
}

export async function desassociarProdutoDoPedido(req, reply) {
  try {
    const { idPedido, idProduto } = req.params;

    const produtosDoPedido = await pedidoProdutoService.getProdutosByPedidoId(idPedido);
    const associacaoExiste = produtosDoPedido.some(p => p.idProduto == idProduto);

    if (!associacaoExiste) {
      return reply.code(404).send({ message: 'Associação de produto e pedido não encontrada.' });
    }

    await pedidoProdutoService.disassociateProdutoFromPedido(idPedido, idProduto);
    reply.send({ message: 'Associação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao desassociar produto do pedido:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao desassociar produto do pedido.' });
  }
}

export async function obterProdutosDoPedido(req, reply) {
  try {
    const { idPedido } = req.params;

    const pedidoExiste = await pedidoService.getPedidoById(idPedido);
    if (!pedidoExiste) {
      return reply.code(404).send({ message: `Pedido com ID ${idPedido} não encontrado.` });
    }

    const produtos = await pedidoProdutoService.getProdutosByPedidoId(idPedido);
    reply.send(produtos);
  } catch (error) {
    console.error('Erro ao obter produtos do pedido:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao obter produtos do pedido.' });
  }
}

export async function obterPedidosDoProduto(req, reply) {
  try {
    const { idProduto } = req.params;

    const produtoExiste = await produtoService.getProdutoById(idProduto);
    if (!produtoExiste) {
      return reply.code(404).send({ message: `Produto com ID ${idProduto} não encontrado.` });
    }

    const pedidos = await pedidoProdutoService.getPedidosByProdutoId(idProduto);
    reply.send(pedidos);
  } catch (error) {
    console.error('Erro ao obter pedidos do produto:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao obter pedidos do produto.' });
  }
}
