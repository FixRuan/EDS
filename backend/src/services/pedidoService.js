import db from '../models/db.js';

export async function getAllPedidos() {
  const [rows] = await db.query('SELECT * FROM Pedido');
  return rows;
}

export async function getPedidoById(id) {
  const [rows] = await db.query('SELECT * FROM Pedido WHERE idPedido = ?', [id]);
  return rows[0];
}

export async function createPedido(pedido) {
  const { idCliente, idFuncionario, formaPagamento, observacoes, status } = pedido;
  const dataHora = new Date();
  const [result] = await db.query(
    'INSERT INTO Pedido (idCliente, idFuncionario, dataHora, formaPagamento, observacoes, status) VALUES (?, ?, ?, ?, ?, ?)',
    [idCliente, idFuncionario, dataHora, formaPagamento, observacoes, status]
  );
  return { idPedido: result.insertId, ...pedido, dataHora };
}

export async function updatePedido(id, pedido) {
  const { idCliente, idFuncionario, formaPagamento, observacoes, status } = pedido;

  await db.query(
    'UPDATE Pedido SET idCliente=?, idFuncionario=?, formaPagamento=?, observacoes=?, status=? WHERE idPedido=?',
    [idCliente, idFuncionario, formaPagamento, observacoes, status, id]
  );
  return { idPedido: id, ...pedido };
}

export async function deletePedido(id) {
  await db.query('DELETE FROM Pedido WHERE idPedido = ?', [id]);
  return { idPedido: id, message: 'Pedido excluído com sucesso' };
}
