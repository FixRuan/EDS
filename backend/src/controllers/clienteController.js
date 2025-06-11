import * as clienteService from '../services/clienteService.js';

export async function listarClientes(req, reply) {
  try {
    const clientes = await clienteService.getAllClientes();
    reply.send(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao listar clientes.' });
  }
}

export async function obterCliente(req, reply) {
  try {
    const { id } = req.params;
    const cliente = await clienteService.getClienteById(id);
    if (!cliente) {
      return reply.code(404).send({ message: 'Cliente não encontrado' });
    }
    reply.send(cliente);
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao obter cliente.' });
  }
}

export async function criarCliente(req, reply) {
  try {
    const novoCliente = await clienteService.createCliente(req.body);
    reply.code(201).send(novoCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao criar cliente.' });
  }
}

export async function atualizarCliente(req, reply) {
  try {
    const { id } = req.params;
    const clienteExistente = await clienteService.getClienteById(id);
    if (!clienteExistente) {
      return reply.code(404).send({ message: 'Cliente não encontrado para atualização.' });
    }
    const clienteAtualizado = await clienteService.updateCliente(id, req.body);
    reply.send(clienteAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao atualizar cliente.' });
  }
}

export async function excluirCliente(req, reply) {
  try {
    const { id } = req.params;
    const clienteExistente = await clienteService.getClienteById(id);
    if (!clienteExistente) {
      return reply.code(404).send({ message: 'Cliente não encontrado para exclusão.' });
    }
    await clienteService.deleteCliente(id);
    reply.send({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao excluir cliente.' });
  }
}
