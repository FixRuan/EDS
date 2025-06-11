import * as pedidoService from '../services/pedidoService.js';

import * as clienteService from '../services/clienteService.js';
import * as funcionarioService from '../services/funcionarioService.js';

const FORMA_PAGAMENTO_ENUM = ['dinheiro', 'pix', 'cartao'];
const STATUS_ENUM = ['preparando', 'pronto', 'entregue', 'cancelado'];

export async function listarPedidos(req, reply) {
  try {
    const pedidos = await pedidoService.getAllPedidos();
    reply.send(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao listar pedidos.' });
  }
}

export async function obterPedido(req, reply) {
  try {
    const { id } = req.params;
    const pedido = await pedidoService.getPedidoById(id);
    if (!pedido) {
      return reply.code(404).send({ message: 'Pedido não encontrado' });
    }
    reply.send(pedido);
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao obter pedido.' });
  }
}

export async function criarPedido(req, reply) {
  try {
    const { idCliente, idFuncionario, formaPagamento, status } = req.body;

    if (idCliente) {
      const clienteExiste = await clienteService.getClienteById(idCliente);
      if (!clienteExiste) {
        return reply.code(400).send({ message: 'ID do Cliente inválido.' });
      }
    }
    if (idFuncionario) {
      const funcionarioExiste = await funcionarioService.getFuncionarioById(idFuncionario);
      if (!funcionarioExiste) {
        return reply.code(400).send({ message: 'ID do Funcionário inválido.' });
      }
    }

    if (formaPagamento && !FORMA_PAGAMENTO_ENUM.includes(formaPagamento)) {
      return reply.code(400).send({ message: `Forma de pagamento inválida. Use um dos seguintes: ${FORMA_PAGAMENTO_ENUM.join(', ')}` });
    }
    if (status && !STATUS_ENUM.includes(status)) {
      return reply.code(400).send({ message: `Status inválido. Use um dos seguintes: ${STATUS_ENUM.join(', ')}` });
    }

    const novoPedido = await pedidoService.createPedido(req.body);
    reply.code(201).send(novoPedido);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return reply.code(400).send({ message: 'ID de Cliente ou Funcionário não existe.' });
    }
    reply.code(500).send({ message: 'Erro interno do servidor ao criar pedido.' });
  }
}

export async function atualizarPedido(req, reply) {
  try {
    const { id } = req.params;
    const { idCliente, idFuncionario, formaPagamento, status } = req.body;

    const pedidoExistente = await pedidoService.getPedidoById(id);
    if (!pedidoExistente) {
      return reply.code(404).send({ message: 'Pedido não encontrado para atualização.' });
    }

    if (idCliente) {
      const clienteExiste = await clienteService.getClienteById(idCliente);
      if (!clienteExiste) {
        return reply.code(400).send({ message: 'ID do Cliente inválido.' });
      }
    }
    if (idFuncionario) {
      const funcionarioExiste = await funcionarioService.getFuncionarioById(idFuncionario);
      if (!funcionarioExiste) {
        return reply.code(400).send({ message: 'ID do Funcionário inválido.' });
      }
    }
    if (formaPagamento && !FORMA_PAGAMENTO_ENUM.includes(formaPagamento)) {
      return reply.code(400).send({ message: `Forma de pagamento inválida. Use um dos seguintes: ${FORMA_PAGAMENTO_ENUM.join(', ')}` });
    }
    if (status && !STATUS_ENUM.includes(status)) {
      return reply.code(400).send({ message: `Status inválido. Use um dos seguintes: ${STATUS_ENUM.join(', ')}` });
    }

    const pedidoAtualizado = await pedidoService.updatePedido(id, req.body);
    reply.send(pedidoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return reply.code(400).send({ message: 'ID de Cliente ou Funcionário não existe.' });
    }
    reply.code(500).send({ message: 'Erro interno do servidor ao atualizar pedido.' });
  }
}

export async function excluirPedido(req, reply) {
  try {
    const { id } = req.params;
    const pedidoExistente = await pedidoService.getPedidoById(id);
    if (!pedidoExistente) {
      return reply.code(404).send({ message: 'Pedido não encontrado para exclusão.' });
    }
    await pedidoService.deletePedido(id);
    reply.send({ message: 'Pedido excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return reply.code(409).send({ message: 'Não é possível excluir o pedido pois existem produtos associados a ele.' });
    }
    reply.code(500).send({ message: 'Erro interno do servidor ao excluir pedido.' });
  }
}
