import db from '../models/db.js';

export async function associateProdutoToPedido(idPedido, idProduto) {
  const [result] = await db.query(
    'INSERT INTO Pedido_Produto (idPedido, idProduto) VALUES (?, ?)',
    [idPedido, idProduto]
  );
  return { idPedido, idProduto };
}
export async function disassociateProdutoFromPedido(idPedido, idProduto) {
  await db.query(
    'DELETE FROM Pedido_Produto WHERE idPedido = ? AND idProduto = ?',
    [idPedido, idProduto]
  );
  return { idPedido, idProduto, message: 'Associação excluída com sucesso' };
}

export async function getProdutosByPedidoId(idPedido) {
  const [rows] = await db.query(
    `SELECT p.idProduto, p.nome, p.descricao, p.preco, p.categoria, p.disponivel
     FROM Produto p
     JOIN Pedido_Produto pp ON p.idProduto = pp.idProduto
     WHERE pp.idPedido = ?`,
    [idPedido]
  );
  return rows;
}

export async function getPedidosByProdutoId(idProduto) {
  const [rows] = await db.query(
    `SELECT pe.idPedido, pe.idCliente, pe.idFuncionario, pe.dataHora, pe.formaPagamento, pe.observacoes, pe.status
     FROM Pedido pe
     JOIN Pedido_Produto pp ON pe.idPedido = pp.idPedido
     WHERE pp.idProduto = ?`,
    [idProduto]
  );
  return rows;
}
