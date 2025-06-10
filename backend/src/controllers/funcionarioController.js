import * as funcionarioService from '../services/funcionarioService.js';

export async function listarFuncionarios(req, reply) {
  try {
    const funcionarios = await funcionarioService.getAllFuncionarios();
    reply.send(funcionarios);
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao listar funcionários.' });
  }
}

export async function obterFuncionario(req, reply) {
  try {
    const { id } = req.params;
    const funcionario = await funcionarioService.getFuncionarioById(id);
    if (!funcionario) {
      return reply.code(404).send({ message: 'Funcionário não encontrado' });
    }
    reply.send(funcionario);
  } catch (error) {
    console.error('Erro ao obter funcionário:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao obter funcionário.' });
  }
}

export async function criarFuncionario(req, reply) {
  try {
    const novoFuncionario = await funcionarioService.createFuncionario(req.body);
    reply.code(201).send(novoFuncionario);
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return reply.code(409).send({ message: 'Login já existe. Por favor, escolha outro.' });
    }
    reply.code(500).send({ message: 'Erro interno do servidor ao criar funcionário.' });
  }
}

export async function atualizarFuncionario(req, reply) {
  try {
    const { id } = req.params;
    const funcionarioExistente = await funcionarioService.getFuncionarioById(id);
    if (!funcionarioExistente) {
      return reply.code(404).send({ message: 'Funcionário não encontrado para atualização.' });
    }
    const funcionarioAtualizado = await funcionarioService.updateFuncionario(id, req.body);
    reply.send(funcionarioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
     if (error.code === 'ER_DUP_ENTRY') {
      return reply.code(409).send({ message: 'Login já existe para outro funcionário. Por favor, escolha outro.' });
    }
    reply.code(500).send({ message: 'Erro interno do servidor ao atualizar funcionário.' });
  }
}

export async function excluirFuncionario(req, reply) {
  try {
    const { id } = req.params;
    const funcionarioExistente = await funcionarioService.getFuncionarioById(id);
    if (!funcionarioExistente) {
      return reply.code(404).send({ message: 'Funcionário não encontrado para exclusão.' });
    }
    await funcionarioService.deleteFuncionario(id);
    reply.send({ message: 'Funcionário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    reply.code(500).send({ message: 'Erro interno do servidor ao excluir funcionário.' });
  }
}
