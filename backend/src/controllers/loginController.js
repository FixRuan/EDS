import { autenticarFuncionario } from '../services/loginService.js';

export async function loginFuncionario(req, reply) {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return reply.code(400).send({ message: 'Login e senha são obrigatórios.' });
  }

  try {
    const result = await autenticarFuncionario(login, senha);

    if (!result) {
      return reply.code(401).send({ message: 'Credenciais inválidas.' });
    }

    return reply.send({
      message: 'Login realizado com sucesso.',
      funcionario: result.funcionario,
      token: result.token
    });
  } catch (error) {
    console.error('Erro ao autenticar funcionário:', error);
    reply.code(500).send({ message: 'Erro interno no servidor ao tentar login.' });
  }
}
