import db from '../models/db.js';

export async function getAllClientes() {
  const [rows] = await db.query('SELECT * FROM Cliente');
  return rows;
}

export async function getClientesParaSelecao() {
  const [rows] = await db.query('SELECT idCliente AS id, nome FROM Cliente');
  return rows;
}

export async function getClienteById(id) {
  const [rows] = await db.query('SELECT * FROM Cliente WHERE idCliente = ?', [id]);
  return rows[0];
}

export async function createCliente(cliente) {
  const { nome, telefone, endereco } = cliente;
  const [result] = await db.query(
    'INSERT INTO Cliente (nome, telefone, endereco) VALUES (?, ?, ?)',
    [nome, telefone, endereco]
  );
  return { idCliente: result.insertId, ...cliente };
}

export async function updateCliente(id, cliente) {
  const { nome, telefone, endereco } = cliente;
  await db.query(
    'UPDATE Cliente SET nome=?, telefone=?, endereco=? WHERE idCliente=?',
    [nome, telefone, endereco, id]
  );
  return { idCliente: id, ...cliente };
}

export async function deleteCliente(id) {
  await db.query('DELETE FROM Cliente WHERE idCliente = ?', [id]);
  return { idCliente: id, message: 'Cliente excluído com sucesso' };
}
