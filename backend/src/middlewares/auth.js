import jwt from 'jsonwebtoken';

const JWT_SECRET = 'adminToken';

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

export function apenasAdmin(req, reply, done) {
  if (req.user.funcao !== 'administrador') {
    return reply.code(403).send({ message: 'Acesso negado. Apenas administradores podem acessar.' });
  }
  done();
}
