import {
  obterFaturamento,
  obterMaisVendidos
} from '../controllers/adminController.js';

import { autenticarJWT, apenasAdmin } from '../middlewares/auth.js';

export default async function funcionarioRoutes(fastify, opts) {
  fastify.addHook('onRequest', autenticarJWT);

  fastify.get('/dashboard/faturamento', { preHandler: apenasAdmin }, obterFaturamento);
  fastify.get('/dashboard/mais-vendidos', { preHandler: apenasAdmin }, obterMaisVendidos);

}
