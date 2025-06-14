import { autenticarJWT, apenasAdmin, verificarPermissao } from '../middlewares/auth.js';
import {
  listarClientes,
  obterCliente,
  criarCliente,
  atualizarCliente,
  excluirCliente,
  listarClientesParaSelecao
} from '../controllers/clienteController.js';

export default async function clienteRoutes(fastify, opts) {
  fastify.addHook('onRequest', autenticarJWT);

  fastify.get('/selecionar', {
    preHandler: verificarPermissao('administrador', 'garcom', 'caixa')
  }, listarClientesParaSelecao);

  fastify.get('/', { preHandler: apenasAdmin }, listarClientes);
  fastify.get('/:id', { preHandler: apenasAdmin }, obterCliente);
  fastify.post('/', { preHandler: apenasAdmin }, criarCliente);
  fastify.put('/:id', { preHandler: apenasAdmin }, atualizarCliente);
  fastify.delete('/:id', { preHandler: apenasAdmin }, excluirCliente);
}
