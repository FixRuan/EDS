import { loginFuncionario } from '../controllers/loginController.js';

export default async function loginRoutes(fastify, opts) {
  fastify.post('/login', loginFuncionario);
}
