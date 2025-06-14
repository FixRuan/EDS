import {
  listarFuncionarios,
  obterFuncionario,
  criarFuncionario,
  atualizarFuncionario,
  excluirFuncionario,
  listarFuncionariosParaSelecao
} from '../controllers/funcionarioController.js';

import { autenticarJWT, apenasAdmin, verificarPermissao } from '../middlewares/auth.js';

export default async function funcionarioRoutes(fastify, opts) {
  fastify.addHook('onRequest', autenticarJWT);

  fastify.get('/selecionar', {
    preHandler: verificarPermissao('administrador', 'garcom', 'caixa')
  }, listarFuncionariosParaSelecao);

  fastify.get('/', { preHandler: apenasAdmin }, listarFuncionarios);
  fastify.get('/:id', { preHandler: apenasAdmin }, obterFuncionario);
  fastify.post('/', { preHandler: apenasAdmin }, criarFuncionario);
  fastify.put('/:id', { preHandler: apenasAdmin }, atualizarFuncionario);
  fastify.delete('/:id', { preHandler: apenasAdmin }, excluirFuncionario);
}
