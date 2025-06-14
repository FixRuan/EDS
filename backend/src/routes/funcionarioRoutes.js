import {
  listarFuncionarios,
  obterFuncionario,
  criarFuncionario,
  atualizarFuncionario,
  excluirFuncionario
} from '../controllers/funcionarioController.js';

import { autenticarJWT, apenasAdmin } from '../middlewares/auth.js';

export default async function funcionarioRoutes(fastify, opts) {
  fastify.addHook('onRequest', autenticarJWT);
  fastify.addHook('onRequest', apenasAdmin);

  fastify.get('/', listarFuncionarios);
  fastify.get('/:id', obterFuncionario);
  fastify.post('/', criarFuncionario);
  fastify.put('/:id', atualizarFuncionario);
  fastify.delete('/:id', excluirFuncionario);
}
