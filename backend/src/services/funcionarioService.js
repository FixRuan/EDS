import db from '../models/db.js';

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

  const [result] = await db.query(
    'INSERT INTO Funcionario (nome, funcao, horarioTrabalho, login, senha) VALUES (?, ?, ?, ?, ?)',
    [nome, funcao, horarioTrabalho, login, senha]
  );
  return { idFuncionario: result.insertId, ...funcionario };
}

export async function updateFuncionario(id, funcionario) {
  const { nome, funcao, horarioTrabalho, login, senha } = funcionario;
  await db.query(
    'UPDATE Funcionario SET nome=?, funcao=?, horarioTrabalho=?, login=?, senha=? WHERE idFuncionario=?',
    [nome, funcao, horarioTrabalho, login, senha, id]
  );
  return { idFuncionario: id, ...funcionario };
}

export async function deleteFuncionario(id) {
  await db.query('DELETE FROM Funcionario WHERE idFuncionario = ?', [id]);
  return { idFuncionario: id, message: 'Funcionário excluído com sucesso' };
}
