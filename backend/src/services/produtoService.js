import db from '../models/db.js';

export async function getAllProdutos() {
  const [rows] = await db.query('SELECT * FROM Produto');
  return rows;
}

export async function getProdutoById(id) {
  const [rows] = await db.query('SELECT * FROM Produto WHERE idProduto = ?', [id]);
  return rows[0];
}

export async function createProduto(produto) {
  const { nome, descricao, preco, categoria, disponivel } = produto;
  const [result] = await db.query(
    'INSERT INTO Produto (nome, descricao, preco, categoria, disponivel) VALUES (?, ?, ?, ?, ?)',
    [nome, descricao, preco, categoria, disponivel]
  );
  return { id: result.insertId, ...produto };
}

export async function updateProduto(id, produto) {
  const { nome, descricao, preco, categoria, disponivel } = produto;
  await db.query(
    'UPDATE Produto SET nome=?, descricao=?, preco=?, categoria=?, disponivel=? WHERE idProduto=?',
    [nome, descricao, preco, categoria, disponivel, id]
  );
  return { id, ...produto };
}

export async function deleteProduto(id) {
  await db.query('DELETE FROM Produto WHERE idProduto = ?', [id]);
  return { id };
}
