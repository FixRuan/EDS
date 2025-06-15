import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function autenticarJWT(req, reply, done) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    done();
  } catch (err) {
    reply.code(403).send({ message: 'Token inválido ou expirado.' });
  }
}

export function verificarPermissao(...funcoesPermitidas) {
  return (req, reply, done) => {
    const { funcao } = req.user;
    if (!funcoesPermitidas.includes(funcao)) {
      return reply.code(403).send({ message: 'Acesso negado' });
    }
    done();
  };
}

export function apenasAdmin(req, reply, done) {
  if (req.user.funcao !== 'administrador') {
    return reply.code(403).send({ message: 'Acesso negado. Apenas administradores podem acessar.' });
  }
  done();
}
