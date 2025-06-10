import {
  listarFuncionarios,
  obterFuncionario,
  criarFuncionario,
  atualizarFuncionario,
  excluirFuncionario
} from '../controllers/funcionarioController.js';

export default async function funcionarioRoutes(fastify, opts) {
  fastify.get('/', listarFuncionarios);
  fastify.get('/:id', obterFuncionario);
  fastify.post('/', criarFuncionario);
  fastify.put('/:id', atualizarFuncionario);
  fastify.delete('/:id', excluirFuncionario);
}
