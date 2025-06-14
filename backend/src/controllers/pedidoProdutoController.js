import * as pedidoProdutoService from '../services/pedidoProdutoService.js';

import * as pedidoService from '../services/pedidoService.js';
import * as produtoService from '../services/produtoService.js';

export async function associarProdutoAPedido(req, reply) {
  try {
    const { idPedido, idProduto, quantidade } = req.body;

    if (!idPedido || !idProduto || !quantidade) {
      return reply.code(400).send({ message: 'IDs e quantidade são obrigatórios.' });
    }

    const pedidoExiste = await pedidoService.getPedidoById(idPedido);
    const produto = await produtoService.getProdutoById(idProduto);

    if (!pedidoExiste || !produto) {
      return reply.code(404).send({ message: 'Pedido ou produto não encontrado.' });
    }

    if (produto.quantidadeEstoque < quantidade) {
      return reply.code(400).send({ message: 'Estoque insuficiente para esse produto.' });
    }

    const novaAssociacao = await pedidoProdutoService.associateProdutoToPedido(idPedido, idProduto, quantidade);
    reply.code(201).send(novaAssociacao);
  } catch (error) {
    console.error('Erro ao associar produto ao pedido:', error);
    reply.code(500).send({ message: 'Erro interno ao associar produto ao pedido.' });
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

export async function atualizarQuantidadeProdutoDoPedido(req, reply) {
  try {
    const { idPedido, idProduto } = req.params;
    const { quantidade } = req.body;

    if (!quantidade || quantidade < 1) {
      return reply.code(400).send({ message: 'Quantidade inválida' });
    }

    const pedidoExiste = await pedidoService.getPedidoById(idPedido);
    const produtoExiste = await produtoService.getProdutoById(idProduto);

    if (!pedidoExiste || !produtoExiste) {
      return reply.code(404).send({ message: 'Pedido ou produto não encontrado' });
    }

    const resultado = await pedidoProdutoService.updateQuantidadeProdutoDoPedido(
      idPedido,
      idProduto,
      quantidade
    );

    reply.send(resultado);
  } catch (error) {
    console.error('Erro ao atualizar quantidade do produto no pedido:', error.message);
    if (error.message === 'Estoque insuficiente') {
      return reply.code(400).send({ message: 'Estoque insuficiente para atualizar a quantidade' });
    }
    if (error.message === 'Associação não encontrada') {
      return reply.code(404).send({ message: 'Associação entre pedido e produto não encontrada' });
    }
    reply.code(500).send({ message: 'Erro interno ao atualizar a quantidade do produto no pedido' });
  }
}
