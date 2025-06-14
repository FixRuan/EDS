import db from '../models/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'adminToken';

export async function autenticarFuncionario(login, senha) {
  const [rows] = await db.query('SELECT * FROM Funcionario WHERE login = ?', [login]);
  const funcionario = rows[0];

  if (!funcionario) return null;

  const senhaCorreta = await bcrypt.compare(senha, funcionario.senha);
  if (!senhaCorreta) return null;

  const token = jwt.sign(
    {
      idFuncionario: funcionario.idFuncionario,
      funcao: funcionario.funcao,
      nome: funcionario.nome,
    },
    JWT_SECRET,
    { expiresIn: '4h' }
  );

  delete funcionario.senha;
  return { funcionario, token };
}
