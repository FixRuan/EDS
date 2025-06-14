import db from '../models/db.js';
import bcrypt from 'bcrypt';

export async function getAllFuncionarios() {
  const [rows] = await db.query('SELECT * FROM Funcionario');
  return rows;
}

export async function getFuncionarioById(id) {
  const [rows] = await db.query('SELECT * FROM Funcionario WHERE idFuncionario = ?', [id]);
  return rows[0];
}

export async function createFuncionario(funcionario) {
  const { nome, funcao, horarioTrabalho, login, senha } = funcionario;

  const senhaHash = await bcrypt.hash(senha, 10);

  const [result] = await db.query(
    'INSERT INTO Funcionario (nome, funcao, horarioTrabalho, login, senha) VALUES (?, ?, ?, ?, ?)',
    [nome, funcao, horarioTrabalho, login, senhaHash]
  );
  return { idFuncionario: result.insertId, ...funcionario, senha: undefined };
}

export async function updateFuncionario(id, funcionario) {
  const { nome, funcao, horarioTrabalho, login, senha } = funcionario;

  let senhaAtualizada = senha;

  if (senha) {
    senhaAtualizada = await bcrypt.hash(senha, 10);
  }

  await db.query(
    'UPDATE Funcionario SET nome=?, funcao=?, horarioTrabalho=?, login=?, senha=? WHERE idFuncionario=?',
    [nome, funcao, horarioTrabalho, login, senhaAtualizada, id]
  );

  return { idFuncionario: id, ...funcionario, senha: undefined };
}

export async function deleteFuncionario(id) {
  await db.query('DELETE FROM Funcionario WHERE idFuncionario = ?', [id]);
  return { idFuncionario: id, message: 'Funcionário excluído com sucesso' };
}
